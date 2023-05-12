export const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Allergy management ',
            version: '0.1.0',
            description:
                'This is a simple allergy management application made with Express and documented with Swagger',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Leapfrog',
                url: 'https://lftechnology.com',
                email: 'lftechnology@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:8080/api',
            },
        ],
    },
    apis: ['./src/controllers/*.js','./src/controllers/*.ts'],
};
