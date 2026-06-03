import {test, expect} from '@playwright/test';

async function createNewUser(request, userName, password) {
    const response = await request.post('https://demoqa.com/Account/v1/User', {
        data: {
            userName,
            password
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    return body;
};

async function loginUser(request, userName, password) {
    const loginResponse = await request.post('https://demoqa.com/Account/v1/Login', {
        data: {
            userName,
            password
        }
    });
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    return loginBody;
};

async function generateToken(request, userName, password) {
    const tokenResponse = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
        data: {
            userName,
            password
        }
    });
    expect(tokenResponse.status()).toBe(200);
    const tokenBody = await tokenResponse.json();
    expect(tokenBody.token).toBeTruthy();
    return tokenBody;
};

test('TC-DEL-001: Verify that user is able to delete their account', async ({request }) => {
        const userName = `gein${Date.now()}`;
        const password = 'Geindou*123';

        await createNewUser(request, userName, password);
        const loginBody = await loginUser(request, userName, password);
        const tokenBody = await generateToken(request, userName, password);
     

        const deleteResponse = await request.delete(`https://demoqa.com/Account/v1/User/${loginBody.userId}`, {
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenBody.token}`
            }
        });

        expect(deleteResponse.status()).toBe(204); 
        
        
});

test ('TC-DEL-003: Verify that deleted user account cannot be retrieved after account deletion', async ({request}) => {
            const userName = `john${Date.now()}`;   
            const password = 'Johndou*123';

            await createNewUser(request, userName, password);
            const loginBody = await loginUser(request, userName, password);
            const tokenBody = await generateToken(request, userName, password);
            

            const deleteResponse = await request.delete(`https://demoqa.com/Account/v1/User/${loginBody.userId}`, {
                headers: {
                    
                    'Authorization': `Bearer ${tokenBody.token}`
                }
            });
            expect(deleteResponse.status()).toBe(204);

            const getUserAfterDeletion = await request.get(`https://demoqa.com/Account/v1/User/${loginBody.userId}`, {
                headers: {
                    'Authorization': `Bearer ${tokenBody.token}`
                }
            });
            expect(getUserAfterDeletion.status()).toBe(401);
            const body = await getUserAfterDeletion.json();
            expect(body.message).toContain('User not found');
        });
