// Application State
let currentUser = null;
let deletionRequest = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const deletionPage = document.getElementById('deletionPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginBtnText = document.getElementById('loginBtnText');
const loginSpinner = document.getElementById('loginSpinner');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const requestDate = document.getElementById('requestDate');
const deletionDate = document.getElementById('deletionDate');
const daysRemaining = document.getElementById('daysRemaining');
const countdownText = document.getElementById('countdownText');
const countdown = document.getElementById('countdown');
const confirmDeletionBtn = document.getElementById('confirmDeletionBtn');
const cancelDeletionBtn = document.getElementById('cancelDeletionBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Application starting...');
    console.log('📡 Supabase URL:', window.SUPABASE_URL);
    
    // Ensure supabase is available
    if (!window.supabase) {
        console.error('❌ Supabase client not initialized! Check config.js');
        return;
    }
    
    try {
        const { data: { session }, error: sessionError } = await window.supabase.auth.getSession();
        if (sessionError) {
            console.error('❌ Session error:', sessionError);
        }
        
        if (session) {
            console.log('✅ User session found:', session.user.email);
            currentUser = session.user;
            await checkDeletionRequest();
        } else {
            console.log('ℹ️ No active session, showing login page');
            showLogin();
        }

        // Listen for auth state changes
        window.supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔐 Auth state changed:', event);
            if (event === 'SIGNED_IN' && session) {
                console.log('✅ User signed in:', session.user.email);
                currentUser = session.user;
                checkDeletionRequest();
            } else if (event === 'SIGNED_OUT') {
                console.log('👋 User signed out');
                currentUser = null;
                showLogin();
            }
        });
    } catch (error) {
        console.error('❌ Fatal error on page load:', error);
    }
});

// Login Form Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('🔐 Attempting login for:', email);

    loginError.classList.add('hidden');
    loginBtnText.textContent = 'Signing in...';
    loginSpinner.classList.remove('hidden');

    const { data, error } = await window.supabase.auth.signInWithPassword({
        email,
        password,
    });

    loginBtnText.textContent = 'Sign in to Continue';
    loginSpinner.classList.add('hidden');

    if (error) {
        console.error('❌ Login error:', error);
        loginError.textContent = error.message;
        loginError.classList.remove('hidden');
    } else {
        console.log('✅ Login successful:', data.user.email);
        currentUser = data.user;
        await checkDeletionRequest();
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    const { error } = await window.supabase.auth.signOut();
    if (!error) {
        currentUser = null;
        deletionRequest = null;
        showLogin();
    }
});

// Check if user already has a deletion request
async function checkDeletionRequest() {
    try {
        console.log('🔍 Checking for existing deletion request...');
        const { data, error } = await window.supabase
            .from('account_deletion_requests')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('❌ Error checking deletion request:', error);
            // Table might not exist, show deletion page anyway
            showDeletionPage(null);
            return;
        }

        if (data) {
            console.log('✅ Found existing deletion request:', data);
            deletionRequest = data;
            showDeletionPage(data);
        } else {
            console.log('ℹ️ No existing deletion request');
            showDeletionPage(null);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showDeletionPage(null);
    }
}

// Show Deletion Page
function showDeletionPage(request) {
    loginPage.classList.add('hidden');
    deletionPage.classList.remove('hidden');
    errorState.classList.add('hidden');
    successMessage.classList.add('hidden');
    
    if (currentUser) {
        userEmailDisplay.textContent = currentUser.email;
    }

    if (request) {
        // User already has a deletion request
        const requestDateObj = new Date(request.requested_at);
        const deletionDateObj = new Date(request.deletion_date);
        const now = new Date();
        
        requestDate.textContent = requestDateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        deletionDate.textContent = deletionDateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Calculate days remaining
        const daysLeft = Math.ceil((deletionDateObj - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft > 0) {
            daysRemaining.textContent = daysLeft;
            countdownText.textContent = `Your account will be permanently deleted on ${deletionDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
            confirmDeletionBtn.classList.add('hidden');
            cancelDeletionBtn.textContent = 'Cancel Deletion Request';
            successMessage.classList.remove('hidden');
        } else {
            daysRemaining.textContent = '0';
            countdownText.textContent = 'Your account deletion is scheduled for today.';
            confirmDeletionBtn.classList.add('hidden');
            cancelDeletionBtn.classList.add('hidden');
        }

        // Start countdown timer
        startCountdown(deletionDateObj);
    } else {
        // New deletion request
        const deletionDateObj = new Date();
        deletionDateObj.setDate(deletionDateObj.getDate() + 10);
        
        requestDate.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        deletionDate.textContent = deletionDateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        daysRemaining.textContent = '10';
        countdownText.textContent = `Your account will be permanently deleted on ${deletionDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        confirmDeletionBtn.classList.remove('hidden');
        cancelDeletionBtn.classList.add('hidden');
    }
}

// Confirm Deletion Request
confirmDeletionBtn.addEventListener('click', async () => {
    if (!currentUser) return;

    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    confirmDeletionBtn.disabled = true;
    cancelDeletionBtn.disabled = true;

    try {
        const deletionDateObj = new Date();
        deletionDateObj.setDate(deletionDateObj.getDate() + 10);

        console.log('📝 Creating deletion request...');
        const { data, error } = await window.supabase
            .from('account_deletion_requests')
            .insert([
                {
                    user_id: currentUser.id,
                    email: currentUser.email,
                    requested_at: new Date().toISOString(),
                    deletion_date: deletionDateObj.toISOString(),
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('❌ Error creating deletion request:', error);
            throw error;
        }

        console.log('✅ Deletion request created:', data);
        deletionRequest = data;
        
        loadingState.classList.add('hidden');
        successMessage.classList.remove('hidden');
        confirmDeletionBtn.classList.add('hidden');
        cancelDeletionBtn.classList.remove('hidden');
        cancelDeletionBtn.textContent = 'Cancel Deletion Request';
        
        // Update display
        showDeletionPage(data);
        
    } catch (error) {
        console.error('❌ Error:', error);
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        errorMessage.textContent = error.message || 'Failed to submit deletion request. Please try again.';
        confirmDeletionBtn.disabled = false;
        cancelDeletionBtn.disabled = false;
    }
});

// Cancel Deletion Request
cancelDeletionBtn.addEventListener('click', async () => {
    if (!deletionRequest) return;

    if (!confirm('Are you sure you want to cancel your account deletion request?')) {
        return;
    }

    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    cancelDeletionBtn.disabled = true;

    try {
        console.log('🗑️ Cancelling deletion request...');
        const { error } = await window.supabase
            .from('account_deletion_requests')
            .delete()
            .eq('id', deletionRequest.id);

        if (error) {
            console.error('❌ Error cancelling deletion request:', error);
            throw error;
        }

        console.log('✅ Deletion request cancelled');
        deletionRequest = null;
        
        loadingState.classList.add('hidden');
        showDeletionPage(null);
        
    } catch (error) {
        console.error('❌ Error:', error);
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        errorMessage.textContent = error.message || 'Failed to cancel deletion request. Please try again.';
        cancelDeletionBtn.disabled = false;
    }
});

// Start Countdown Timer
function startCountdown(deletionDate) {
    const updateCountdown = () => {
        const now = new Date();
        const diff = deletionDate - now;
        
        if (diff <= 0) {
            daysRemaining.textContent = '0';
            countdownText.textContent = 'Your account deletion is scheduled for today.';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        daysRemaining.textContent = days;
        
        if (days === 0) {
            countdownText.textContent = `Less than ${hours} hours remaining`;
        } else if (days === 1) {
            countdownText.textContent = `1 day and ${hours} hours remaining`;
        } else {
            countdownText.textContent = `${days} days remaining`;
        }
    };
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// Show Login Page
function showLogin() {
    loginPage.classList.remove('hidden');
    deletionPage.classList.add('hidden');
    loginForm.reset();
    loginError.classList.add('hidden');
}
