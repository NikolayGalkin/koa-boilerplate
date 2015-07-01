var Router = require('koa-router');
var glob   = require('glob');
var path   = require('path');
var _      = require('lodash');

module.exports = function(options) {

    var controllers = glob.sync(path.join(options.controllersPath, '*.js'), {cwd: __dirname}).map(require);
    var router;

    _.each(controllers, function(controller) {
        router = Router({prefix: controller.prefix});
        var path   = controller.path;
        delete controller.prefix;
        delete controller.path;

        _.forIn(controller, function(action, method) {
            switch (true) {
                case method === 'param':
                    router.param('id', action);
                    break;
                case method === 'list':
                    router.get(path, action);
                    break;
                case method === 'create':
                    router.post(path, action);
                    break;
                case method === 'detail':
                    router.get(path + '/:id', action);
                    break;
                case method === 'update':
                    router.put(path + '/:id', action);
                    break;
                case method === 'remove':
                    router.del(path + '/:id', action);
                    break;
            }
        })
    });
    return router.routes()
};
