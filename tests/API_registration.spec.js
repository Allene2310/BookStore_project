import {test, expect} from '@playwright/test';



async function cleanUp(request, userName, password, userId) {
   
    const tokenResponse = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
        data: {
            "userName": userName,
            "password": password
        },
        headers:{
            'Content-Type': 'application/json'
        }
    });
    expect(tokenResponse.status()).toBe(200);
    const tokenBody = await tokenResponse.json();
    const token = tokenBody.token;

    const deleteResponse = await request.delete(`https://demoqa.com/Account/v1/User/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    expect(deleteResponse.status()).toBe(204);
};


test.describe('API registration tests', () => {

    let password;
    let body;

    test.afterEach(async ({request}) => {
        if (body?.userID) {
            await cleanUp(request, body.username, password, body.userID)
        }
        body = undefined;
    });


    test('TC-REG-002: Registration with valid data', async ({request}) => {
        const userName = `gein${Date.now()}`;
        password = "Geindou*123";

        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        expect(response.status()).toBe(201);
        
        body = await response.json();
        expect(body.username).toBe(userName);
        expect(body.userID).toBeDefined();

    }); 


    test('TC-REG-009: Registration with existing username', async ({request}) => {
        const userName = `gein${Date.now()}`;
        password = "Geindou*123";

        const firstResponse = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        expect(firstResponse.status()).toBe(201);

        body = await firstResponse.json();
        const user = body.username;
        expect (body.userID).toBeDefined();


        const secondResponse = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": user,   
                "password": password,
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        expect(secondResponse.status()).toBe(406);

        const bodyResp = await secondResponse.json();
        expect(bodyResp.message).toContain('User exists');

    }); 


    test('TC-REG-004: Registration with empty required fields', async ({request}) => {
        const userName = "";
        password = "";

        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        body = await response.json();
       
        expect(response.status()).toBe(400);
        expect(body.message).toContain('UserName and Password required.');

    });


    test('TC-REG-005: Registration with password at minimum required length', async ({request}) => {

        const userName = `gein${Date.now()}`;
        password = "Gein*124";

        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password,
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        expect(response.status()).toBe(201);

        body = await response.json();
        expect(body.username).toBe(userName);
        
        expect(body.userID).toBeDefined();
        
    });


    test('TC-REG-006: Registration with password shorter than minimum required length', async ({request}) => {
        const userName = `gein${Date.now()}`;
        password = "Gein*12";
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        body = await response.json();

        expect(response.status()).toBe(400);
        expect(body.message).toContain("Passwords must have");

    });


    test('TC-REG-007: Registration with password does not meet required characters', async ({request}) => {

        const userName = `gein${Date.now()}`;
        password = "geindou123";
        
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        body = await response.json();

        expect(response.status()).toBe(400);
        expect(body.message).toContain("Passwords must have");

    });


    test('TC-REG-008: Registration with only spaces in UserName', async({request}) => {

        const userName = "          ";
        password = "Geindou*123";

        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });


        body = await response.json();

        expect(response.status()).toBe(400);
        expect(body.message).toContain('UserName and Password required.');
        
    });

    test('TC-REG-011: Registration with leading and trailing spaces in UserName', async({request}) => {

        const userName = `  gein${Date.now()}  `;
        password = "Geindou*123";

        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": password
            }
        });
        expect(response.status()).toBe(201);

        body = await response.json();
        
        const trimmedUsername = body.username.trim();
        expect(body.username).toBe(trimmedUsername);

    });

});

