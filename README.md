By default, both the AngularJS application (bootstrapped by Yeoman) and the Play application tries to run on port 9000.

In production, both applications will likely be run under one domain, and we will probably use Nginx to route the requests accordingly. But in development mode, when we change the port number of one of these applications, web browsers will treat them as if they are running on different domains.

To work around both of these issues, all we need to do is use a Grunt proxy so that all AJAX requests to the Play application are proxied. With this, in essence both of these application servers will be available at the same apparent port number.


To configure a Grunt proxy, we first need to install a small Node.js package using NPM:

npm install grunt-connect-proxy --save-dev

Next we need to tweak our Gruntfile.js. In that file, locate the “connect” task, and insert the “proxies” key/value after it:

 proxies: [
   {
     context: '/app', // the context of the data service
     host: 'localhost', // wherever the data service is running
     port: 9090, // the port that the data service is running on
     changeOrigin: true
   }
 ],

Grunt will now proxy all requests to “/app/*” to the back-end Play application. This will save us from having to whitelist every call to the back-end. Furthermore, we also need to tweak our livereload behavior:

grunt.loadNpmTasks('grunt-connect-proxy');

livereload: {
 options: {
   open: true,

   middleware: function (connect) {
     var middlewares = [];

     // Setup the proxy
     middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

     // Serve static files
     middlewares.push(connect.static('.tmp'));
     middlewares.push(connect().use(
       '/bower_components',
       connect.static('./bower_components')
     ));
     middlewares.push(connect().use(
       '/app/styles',
       connect.static('./app/styles')
     ));
     middlewares.push(connect.static(appConfig.app));

     return middlewares;
   }
 }
}, 


grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
 if (target === 'dist') {
   return grunt.task.run(['build', 'connect:dist:keepalive']);
 }

 grunt.task.run([
   'clean:server',
   'wiredep',
   'concurrent:server',
   'autoprefixer:server',
   'configureProxies:server',
   'connect:livereload',
   'watch'
 ]);
});


Upon restarting Grunt, you should notice the following lines in your logs indicating that the proxy is running:

Running "autoprefixer:server" (autoprefixer) task
File .tmp/styles/main.css created.

Running "configureProxies:server" (configureProxies) task

Running "connect:livereload" (connect) task
Started connect web server on http://localhost:9000
