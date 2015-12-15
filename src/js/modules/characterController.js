var characterController = function (character, key, evt) {
    'use strict';

    // Switch on `evt.type`
    switch (evt.type) {

        // Key Down
        case 'keydown': {

            // Switch on `key`
            switch (key) {

                // A
                case 65: {
                    character.dx = -1;
                    break;
                }

                // W
                case 87: {
                    character.dy = -1;
                    break;
                }

                // D
                case 68: {
                    character.dx = 1;
                    break;
                }

                // S
                case 83: {
                    character.dy = 1;
                    break;
                }
            }
            break;
        }

        // Key Up
        case 'keyup': {

            // Switch on `key`
            switch (key) {

                // A
                case 65: {
                    character.dx = 0;
                    break;
                }

                // W
                case 87: {
                    character.dy = 0;
                    break;
                }

                // D
                case 68: {
                    character.dx = 0;
                    break;
                }

                // S
                case 83: {
                    character.dy = 0;
                    break;
                }
            }
            break;
        }
    }
};

module.exports = characterController;
