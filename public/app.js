// Global state
let apiKey = localStorage.getItem('apiKey') || '';
let currentEditId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (apiKey) {
        document.getElementById('apiKey').value = apiKey;
        loadData();
        loadStats();
    }
});

// Save API Key
function saveApiKey() {
    const key = document.getElementById('apiKey').value.trim();
    if (!key) {
        showToast('Please enter an API key', 'error');
        return;
    }
    apiKey = key;
    localStorage.setItem('apiKey', key);
    showToast('API key saved successfully', 'success');
    loadData();
    loadStats();
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    if (!apiKey) {
        showToast('Please set your API key first', 'error');
        throw new Error('No API key');
    }

    const url = `/api${endpoint}`;
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

// Load all data
async function loadData() {
    try {
        const result = await apiRequest('/data');
        renderTable(result.data);
        loadStats();
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Load statistics
async function loadStats() {
    try {
        const result = await apiRequest('/stats');
        document.getElementById('totalEntries').textContent = result.stats.totalEntries;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Render table
function renderTable(data) {
    const tbody = document.getElementById('dataTableBody');
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No data available. Add your first entry!</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(item => `
        <tr>
            <td><strong>${escapeHtml(item.name)}</strong></td>
            <td class="value-cell">${escapeHtml(item.value || '-')}</td>
            <td class="metadata-cell">${escapeHtml(item.metadata || '-')}</td>
            <td class="date-cell">${formatDate(item.created_at)}</td>
            <td class="actions">
                <button onclick="editEntry('${item.id}')" class="btn btn-edit">Edit</button>
                <button onclick="deleteEntry('${item.id}')" class="btn btn-danger">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Handle form submit
async function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const value = document.getElementById('value').value.trim();
    const metadataInput = document.getElementById('metadata').value.trim();
    
    let metadata = null;
    if (metadataInput) {
        try {
            metadata = JSON.parse(metadataInput);
        } catch (error) {
            showToast('Invalid JSON in metadata field', 'error');
            return;
        }
    }
    
    const data = { name, value, metadata };
    
    try {
        if (currentEditId) {
            await apiRequest(`/data/${currentEditId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('Entry updated successfully', 'success');
        } else {
            await apiRequest('/data', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showToast('Entry created successfully', 'success');
        }
        
        resetForm();
        loadData();
    } catch (error) {
        console.error('Failed to submit:', error);
    }
}

// Edit entry
async function editEntry(id) {
    try {
        const result = await apiRequest(`/data/${id}`);
        const item = result.data;

        document.getElementById('editId').value = item.id;
        document.getElementById('name').value = item.name;
        document.getElementById('value').value = item.value || '';
        document.getElementById('metadata').value = item.metadata || '';

        currentEditId = item.id;
        document.getElementById('formTitle').textContent = 'Edit Entry';
        document.getElementById('submitBtnText').textContent = 'Update Entry';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Failed to load entry:', error);
    }
}

// Delete entry
async function deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }

    try {
        await apiRequest(`/data/${id}`, { method: 'DELETE' });
        showToast('Entry deleted successfully', 'success');
        loadData();
    } catch (error) {
        console.error('Failed to delete entry:', error);
    }
}

// Reset form
function resetForm() {
    document.getElementById('dataForm').reset();
    document.getElementById('editId').value = '';
    currentEditId = null;
    document.getElementById('formTitle').textContent = 'Add New Entry';
    document.getElementById('submitBtnText').textContent = 'Add Entry';
}

// Handle search
let searchTimeout;
function handleSearch(event) {
    clearTimeout(searchTimeout);
    const query = event.target.value.trim();

    if (!query) {
        loadData();
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            const result = await apiRequest(`/search?q=${encodeURIComponent(query)}`);
            renderTable(result.data);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }, 300);
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

