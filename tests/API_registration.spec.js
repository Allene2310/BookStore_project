import {test, expect} from '@playwright/test';



test('TC-REG-002: Registration with valid data', async ({request}) => {
        const userName = `gein${Date.now()}`;
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": userName,
                "password": "Geindou*123"

            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        
        const body = await response.json();
        expect(body.username).toBe(userName);
        expect(body.userID).toBeDefined();

        expect(response.status()).toBe(201);
        

}); 


test('TC-REG-009: Registration with existing username', async ({request}) => {
    
        const firstResponse = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": `gein${Date.now()}`,
                "password": "Geindou*123"
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        const body = await firstResponse.json();
        const user = body.username;
        expect(firstResponse.status()).toBe(201);


        const secondResponse = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": user,   
                "password": "Geindou*123"
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        const bodyResp= await secondResponse.json();

        expect(bodyResp.message).toContain('User exists');

        expect(secondResponse.status()).toBe(406);
}); 


test('TC-REG-004: Registration with empty required fields', async ({request}) => {
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": "",
                "password": ""
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        const body = await response.json();
        expect(body.message).toContain('UserName and Password required.');

        expect(response.status()).toBe(400);
});


test('TC-REG-005: Registration with password at minimum required length', async ({request}) => {
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": `gein${Date.now()}`,
                "password": "Gein*124"
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });

        const body = await response.json();
        expect(body.username).toBeDefined();
        expect(body.userID).toBeDefined();
        
        expect(response.status()).toBe(201);
});


test('TC-REG-006: Registration with password shorter than minimum required length', async ({request}) => {
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": `gein${Date.now()}`,
                "password": "Gein*12"
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const body = await response.json();

        expect(body.message).toContain("Passwords must have");

        expect(response.status()).toBe(400);
});


test('TC-REG-007: Registration with password does not meet required characters', async ({request}) => {
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": `gein${Date.now()}`,
                "password": "geindou123"
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const body = await response.json();
        expect(body.message).toContain("Passwords must have");

        expect(response.status()).toBe(400);
});


 test('TC-REG-008: Registration with only spaces in UserName', async({request}) => {
        const response = await request.post('https://demoqa.com/Account/v1/User', {
            data: {
                "userName": "       ",
                "password": "Geindou*125"
            },
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const body = await response.json();
        expect(body.message).not.toContain("User exists");
    
        expect(response.status()).toBe(400);

        
});

test('TC-REG-011: Registration with leading and trailing spaces in UserName', async({request}) => {
    const response = await request.post('https://demoqa.com/Account/v1/User', {
        data: {"userName":`  gein${Date.now()}  `,
                "password": "Geindou*123"}
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    const trimmedUsername = body.username.trim();
    expect(body.username).toBe(trimmedUsername);

});



