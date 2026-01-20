// ===============================
// Prevent Double Initialization
// ===============================
(function() {
  'use strict';
  
  // Prevent script from running twice
  if (window.appInitialized) {
    console.warn('⚠️ App already initialized, skipping...');
    return;
  }
  window.appInitialized = true;

// ===============================
// Supabase Client (IMPORTANT)
// ===============================
// Get Supabase client from window (set by config.js)
const supabase = window.supabaseClient;

if (!supabase) {
  console.error("❌ Supabase client not initialized. Check config.js load order.");
  console.error("Available on window:", Object.keys(window).filter(k => k.includes('supabase')));
  throw new Error("Supabase client missing");
}

// ===============================
// Application State
// ===============================
let currentUser = null;
let deletionRequest = null;

// ===============================
// DOM Elements
// ===============================
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
const confirmDeletionBtn = document.getElementById('confirmDeletionBtn');
const cancelDeletionBtn = document.getElementById('cancelDeletionBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// ===============================
// On Page Load
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 App started');

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Session error:', error);
    }

    if (session?.user) {
      console.log('✅ Session found:', session.user.email);
      currentUser = session.user;
      await checkDeletionRequest();
    } else {
      showLogin();
    }

    // Auth state listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        currentUser = session.user;
        await checkDeletionRequest();
      }

      if (event === 'SIGNED_OUT') {
        currentUser = null;
        deletionRequest = null;
        showLogin();
      }
    });

  } catch (err) {
    console.error('❌ Fatal init error:', err);
  }
});

// ===============================
// Login Handler
// ===============================
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      loginError.textContent = 'Please enter both email and password';
      loginError.classList.remove('hidden');
      return;
    }

    loginError.classList.add('hidden');
    loginBtnText.textContent = 'Signing in...';
    loginSpinner.classList.remove('hidden');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      loginBtnText.textContent = 'Sign in to Continue';
      loginSpinner.classList.add('hidden');

      if (error) {
        console.error('❌ Login failed:', error);
        loginError.textContent = error.message;
        loginError.classList.remove('hidden');
        return;
      }

      currentUser = data.user;
      await checkDeletionRequest();
    } catch (err) {
      console.error('❌ Login error:', err);
      loginBtnText.textContent = 'Sign in to Continue';
      loginSpinner.classList.add('hidden');
      loginError.textContent = 'An error occurred during login. Please try again.';
      loginError.classList.remove('hidden');
    }
  });
} else {
  console.error('❌ Login form not found');
}

// ===============================
// Logout
// ===============================
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
});

// ===============================
// Check Deletion Request
// ===============================
async function checkDeletionRequest() {
  try {
    const { data, error } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Fetch error:', error);
      showDeletionPage(null);
      return;
    }

    deletionRequest = data || null;
    showDeletionPage(deletionRequest);

  } catch (err) {
    console.error('❌ Error:', err);
    showDeletionPage(null);
  }
}

// ===============================
// Show Deletion Page
// ===============================
function showDeletionPage(request) {
  loginPage.classList.add('hidden');
  deletionPage.classList.remove('hidden');
  errorState.classList.add('hidden');
  successMessage.classList.add('hidden');

  userEmailDisplay.textContent = currentUser.email;

  const now = new Date();

  if (request) {
    const reqDate = new Date(request.requested_at);
    const delDate = new Date(request.deletion_date);

    requestDate.textContent = reqDate.toLocaleDateString();
    deletionDate.textContent = delDate.toLocaleDateString();

    const daysLeft = Math.ceil((delDate - now) / 86400000);
    daysRemaining.textContent = Math.max(daysLeft, 0);

    confirmDeletionBtn.classList.add('hidden');
    cancelDeletionBtn.classList.remove('hidden');
    successMessage.classList.remove('hidden');

    startCountdown(delDate);
  } else {
    const delDate = new Date();
    delDate.setDate(delDate.getDate() + 10);

    requestDate.textContent = now.toLocaleDateString();
    deletionDate.textContent = delDate.toLocaleDateString();
    daysRemaining.textContent = '10';

    confirmDeletionBtn.classList.remove('hidden');
    cancelDeletionBtn.classList.add('hidden');
  }
}

// ===============================
// Confirm Deletion
// ===============================
confirmDeletionBtn.addEventListener('click', async () => {
  if (!currentUser) return;

  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');

  const delDate = new Date();
  delDate.setDate(delDate.getDate() + 10);

  const { data, error } = await supabase
    .from('account_deletion_requests')
    .insert({
      user_id: currentUser.id,
      email: currentUser.email,
      requested_at: new Date().toISOString(),
      deletion_date: delDate.toISOString(),
      status: 'pending'
    })
    .select()
    .single();

  loadingState.classList.add('hidden');

  if (error) {
    errorMessage.textContent = error.message;
    errorState.classList.remove('hidden');
    return;
  }

  deletionRequest = data;
  showDeletionPage(data);
});

// ===============================
// Cancel Deletion
// ===============================
cancelDeletionBtn.addEventListener('click', async () => {
  if (!deletionRequest) return;
  if (!confirm('Cancel deletion request?')) return;

  loadingState.classList.remove('hidden');

  const { error } = await supabase
    .from('account_deletion_requests')
    .delete()
    .eq('id', deletionRequest.id);

  loadingState.classList.add('hidden');

  if (error) {
    errorMessage.textContent = error.message;
    errorState.classList.remove('hidden');
    return;
  }

  deletionRequest = null;
  showDeletionPage(null);
});

// ===============================
// Countdown
// ===============================
function startCountdown(targetDate) {
  const update = () => {
    const diff = targetDate - new Date();
    if (diff <= 0) return;

    daysRemaining.textContent = Math.floor(diff / 86400000);
  };
  update();
  setInterval(update, 60000);
}

// ===============================
// Show Login
// ===============================
function showLogin() {
  loginPage.classList.remove('hidden');
  deletionPage.classList.add('hidden');
  loginForm.reset();
  loginError.classList.add('hidden');
}

})(); // End IIFE - prevents double initialization
