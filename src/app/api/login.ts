async function login({ body }: { body: object }) {
    try {
        const response = await fetch(`https://rzsxmvcdsg.us-east-1.awsapprunner.com/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(body),
        });



        if (!response.ok) {
            const errorData = await response.json();
            return { status: response.status, data: errorData };
        }

        const data = await response.json();
        return { status: response.status, data: data };
    } catch (error) {
        return { status: 500, data: 'unknown error', error };
    }
}

export default login;