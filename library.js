(function(module) {
    'use strict';

    var User = module.parent.require('./user'),
        Topics = module.parent.require('./topics'),
        Categories = module.parent.require('./categories'),
        meta = module.parent.require('./meta'),
        db = module.parent.require('../src/database'),
        fs = module.parent.require('fs'),
        path = module.parent.require('path'),
        nconf = module.parent.require('nconf'),
        winston = module.parent.require('winston'),
        async = module.parent.require('async'),
        SlackClient = require('node-slack'),
        slack = null,

        constants = Object.freeze({
            name : 'slack',
            admin: {
                icon  : 'fa-slack',
                route : '/plugins/slack',
                label : 'Slack'
            }
        });
    
    var Slack = {};

    Slack.init = function(app, middleware, controllers, callback) {
        function render(req, res, next) {
            res.render('admin/plugins/slack', {});
        }
        app.get('/admin/plugins/slack', middleware.admin.buildHeader, render);
        app.get('/api/admin/plugins/slack', render);
        slack = new SlackClient(meta.config['slack:domain'], meta.config['slack:token'])
        callback();
    },

    Slack.postSave = function(post) {
        var content = post.content;

        async.parallel({
            user: function(callback) {
                // retrieve user
                User.getUserData(post.uid, function(err, user) {
                    if (err) { return callback(err); }
                    var data = {
                        username : user.username,
                        email    : user.email,
                        image    : user.picture.match(/^\/\//) ? 'http:' + user.picture : user.picture
                    };
                    return callback(null, data);
                })
            },
            topic: function(callback) {
                // retrieve topic and category
                Topics.getTopicData(post.tid, function(err, topic) {
                    if (err) { return callback(err); }
                    Categories.getCategoryData(topic.cid, function(err, category) {
                        if (err) { return callback(err); }
                        var data = {
                            title     : topic.title,
                            category  : category.name,
                            link      : nconf.get('url') + '/topic/' + topic.slug,
                            timestamp : topic.timestamp
                        };
                        return callback(null, data);
                    })
                })  
            }
        }, function(err, data) {
            // trim message based on config option
            var maxContentLength = meta.config['slack:post:maxlength'] || false
            if (maxContentLength && content.length > maxContentLength) { content = content.substring(0, maxContentLength) + '...'; }
            // message format: <username> posted [<categoryname> : <topicname>]\n <message>
            var message = '<' + data.topic.link + '|[' + data.topic.category + ': ' + data.topic.title + ']>\n' + content;

            slack.send({
                'text'     : message,
                'channel'  : (meta.config['slack:channel'] || '#general'),
                'username' : data.user.username,
                'icon_url' : data.user.image
            });
        });
    },

    Slack.adminMenu = function(headers, callback) {
        headers.plugins.push({
            'route' : constants.admin.route,
            'icon'  : constants.admin.icon,
            'name'  : constants.admin.label
        });
        callback(null, headers);
    }

    module.exports = Slack;

}(module));