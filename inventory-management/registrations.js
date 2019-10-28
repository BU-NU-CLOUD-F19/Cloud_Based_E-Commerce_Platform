/**
 * This class defines all the routes to be registered on this application server.
 */

'use strict';

module.exports = function registrations(config) {
    return {
        // Each string in this array is `require`d during composition
        plugins: [
            './src/endpoints',
        ],
    };
};