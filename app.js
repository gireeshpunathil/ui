/*****************************************************************
 *
 * Copyright 2019 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *****************************************************************/

const appName = require('./package').name,
      express = require('express'),
      config = require('./config/config-defaults.json'),
      path = require('path'),
      fs = require('fs'),
      moment = require('moment'),
      i18n = require('node-i18n-util'),
      app = express(),
      request = require('request');

var log4js = require('log4js'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    proxy = require('http-proxy-middleware')

const logger = log4js.getLogger('server')
var log4js_config = process.env.LOG4JS_CONFIG ? JSON.parse(process.env.LOG4JS_CONFIG) : undefined
log4js.configure(log4js_config || 'config/log4js.json')

require('./lib/shared/dust-helpers');
require('./server/routers/index')(app);

const TARGET = process.env.TARGET || "http://localhost:9080",
      CONTEXT_PATH = config.contextPath,
      STATIC_PATH = path.join(__dirname, 'public'),
      KUBE_ENV = process.env.KUBE_ENV || "icp",
      APPNAV_CONFIGMAP_NAMESPACE = process.env.KAPPNAV_CONFIG_NAMESPACE || 'kappnav'

app.use(cookieParser())

app.all('*', function(req, res, next) {
  if(KUBE_ENV === 'icp') {
    var host = 'https://'+req.headers['host']
    var access_token = (req.cookies && req.cookies['cfc-access-token-cookie']) || ''

    var url = host + '/idprovider/v1/auth/exchangetoken';
    var headers = {
      'Content-Type' : 'application/x-www-form-urlencoded'
    };
    var form = { access_token: access_token};

    request.post({ url: url, 
                   form: form, 
		   headers: headers, 
		   method: 'POST', 
		   rejectUnauthorized: false			 
		 }, function (error, response, body) {
	
      if(!error && response.statusCode == 200) {
        req.user = JSON.parse(body).sub
        if(!JSON.parse(body).id_token) {
          return res.redirect(host + '/oidc/logout.jsp?error=noteam')
        }
        next()
      } else {
	//Not a valid token
        return res.redirect(host + '/oidc/logout.jsp?error=noteam')
      }
	
    })
  } else {
    //not ICP, skip getting jwt
    next()
  }
})

app.use(CONTEXT_PATH, express.static(STATIC_PATH, {
  maxAge: process.env.NODE_ENV === 'development' ? 0 : 1000 * 60 * 60 * 24 * 365,
  setHeaders: (res, fp) => {
    if (fp.startsWith(`${STATIC_PATH}/nls`)) {
      res.setHeader('Cache-Control', 'max-age=0')
    } else {
      res.setHeader('Expires', moment().add(12, 'months').toDate())
    }
    res.setHeader('Strict-Transport-Security', 'max-age=99999999')
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-ancestors 'self'")
  }
}))

app.use('/kappnav', proxy({
  target: TARGET,
  changeOrigin: true,
  secure: false
}))

app.use('/kappnav-ui/openshift/appNavIcon.css', function(req, res, next) {
  request({
    url: TARGET + '/kappnav/configmap/kappnav-config?namespace=' + APPNAV_CONFIGMAP_NAMESPACE,
    method: 'GET',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body)
      var url = json.data['kappnav-url']
      let appNavIcon = 
          `
            .icon-appnav {
              background-repeat: no-repeat;
              background-image: url(${url}/graphics/KAppNavlogo.svg);
              height: 20px;
            }
 
           .icon-kappnav-feature {
              display: block;
              background-repeat: no-repeat;
              background-image: url(${url}/graphics/KAppNavlogo.svg);
              height: 72px;
              width: 72px;
            }
          `
      res.type('.css')
      res.send(appNavIcon)
    } else {
      // TODO: How to fail safely?
    }

  })
})

app.use('/kappnav-ui/openshift/featuredApp.js', function(req, res, next) {
  request({
    url: TARGET + '/kappnav/configmap/kappnav-config?namespace='+APPNAV_CONFIGMAP_NAMESPACE,
    method: 'GET',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body)
      var url = json.data['kappnav-url']
      let featuredApp =
          `
            (function() {
              window.OPENSHIFT_CONSTANTS.SAAS_OFFERINGS = [{
                  title: "KAppNav",                         // The text label
                  icon: "icon-kappnav-feature",               // The icon you want to appear
                  url: "${url}",      //  Where to go when this item is clicked
                  description: "Kubernetes Application Navigator"      // Short description
                }];
            }());
          `
      res.type('.js')
      res.send(featuredApp)
    } else {
      // TODO: How to fail safely?
    }
  })
})


app.use('/kappnav-ui/openshift/appLauncher.js', function(req, res, next) {
  request({
    url: TARGET + '/kappnav/configmap/kappnav-config?namespace='+APPNAV_CONFIGMAP_NAMESPACE,
    method: 'GET',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(body)
      var url = json.data['kappnav-url']
      let appLauncher = 
          `
          (function() {
            window.OPENSHIFT_CONSTANTS.APP_LAUNCHER_NAVIGATION = [{
              title: "KAppNav",                            // The text label
              iconClass: "icon-appnav",                    // The icon you want to appearl
              href: "${url}",        // Where to go when this item is clicked
              tooltip: "Kubernetes Application Navigator"             // Optional tooltip to display on hover
            }];
          }());
          `
      res.type('.js')
      res.send(appLauncher)
    } else {
      // TODO: How to fail safely?
    }
  })
})

app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.locals.manifest = require('./public/webpack-assets.json')

var http = require('http')
var server = http.createServer(app)

app.get('*', function(req, res){
  var user = req.user ? req.user : "minikubeUser"
  
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Strict-Transport-Security', 'max-age=99999999')
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' blob: https://"+req.headers['host']+"/*; frame-ancestors 'self'")

  res.render('index', {
        myLocale: i18n.locale(req),
        kube: KUBE_ENV,
        appnavConfigmapNamespace: APPNAV_CONFIGMAP_NAMESPACE,
        contextPath: CONTEXT_PATH,
        user: req.user,
        title: 'Application Navigator'
  });
});


const port = process.env.PORT || config.httpPort;

server.listen(port, function(){
  logger.info(`application navigator listening on  ${process.env.NODE_ENV === 'development' ? 'https' : 'http'}://localhost:${port}${CONTEXT_PATH}`);
});