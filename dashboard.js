document.addEventListener('DOMContentLoaded', () => {
    fetchServerStatus();
    fetchTokens();
});

async function fetchServerStatus() {
    try {
        const response = await fetch('/health', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('apiToken')}`
            }
        });
        const data = await response.json();
        document.getElementById('status-content').innerHTML = `
            <p>Uptime: ${data.uptime}</p>
            <p>Status: ${data.status}</p>
        `;
    } catch (error) {
        console.error('Error fetching server status:', error);
        document.getElementById('status-content').innerHTML = '<p>Error fetching server status</p>';
    }
}

async function fetchTokens() {
    try {
        const response = await fetch('/tokens', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('apiToken')}`
            }
        });
        const data = await response.json();
        const tokensContent = document.getElementById('tokens-content');
        tokensContent.innerHTML = '';
        data.tokens.forEach(token => {
            const tokenElement = document.createElement('div');
            tokenElement.className = 'token';
            tokenElement.innerHTML = `
                <p>ID: ${token.id}</p>
                <p>Locked: ${token.locked}</p>
                <button onclick="deleteToken('${token.id}')">Delete</button>
                <button onclick="lockToken('${token.id}')">Lock</button>
            `;
            tokensContent.appendChild(tokenElement);
        });
    } catch (error) {
        console.error('Error fetching tokens:', error);
        document.getElementById('tokens-content').innerHTML = '<p>Error fetching tokens</p>';
    }
}

async function deleteToken(id) {
    try {
        await fetch(`/tokens/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('apiToken')}`
            }
        });
        fetchTokens();
    } catch (error) {
        console.error('Error deleting token:', error);
    }
}

async function lockToken(id) {
    try {
        await fetch(`/tokens/${id}/lock`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('apiToken')}`
            }
        });
        fetchTokens();
    } catch (error) {
        console.error('Error locking token:', error);
    }
}