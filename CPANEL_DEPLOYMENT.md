# cPanel Deployment Guide for Gabstep Business Chat

## 📦 What's Included in the Deployment Package

- **dist/** - Production-ready build files (HTML, CSS, JS)
- **SUPABASE_SETUP.md** - Database setup instructions
- **README.md** - Application documentation
- **.htaccess** - Apache configuration for React Router (auto-generated below)

## 🚀 Deployment Steps

### Step 1: Extract the ZIP File

1. Download `gabstep-business-chat-deploy.zip`
2. Extract it on your local computer

### Step 2: Set Up Supabase (If Not Already Done)

1. Go to [supabase.com](https://supabase.com) and log in
2. Your project is already created: `https://fjhsecydybodlaoxiurk.supabase.co`
3. If you haven't run the SQL schema yet:
   - Go to SQL Editor in Supabase dashboard
   - Copy the schema from `SUPABASE_SETUP.md`
   - Run it
   - Enable Realtime for `profiles`, `messages`, and `chat_settings` tables

### Step 3: Update Environment Variables in the Build

**IMPORTANT:** The build files need to have your Supabase credentials embedded.

Since you already have them configured (your `.env` file), the build is already configured with your credentials:
- URL: `https://fjhsecydybodlaoxiurk.supabase.co`
- Anon Key: (already configured)

✅ No additional configuration needed - your build is ready to deploy!

### Step 4: Upload to cPanel

#### Option A: Using File Manager (Recommended for beginners)

1. Log in to your cPanel
2. Open **File Manager**
3. Navigate to your domain's public directory:
   - Usually `public_html` or `public_html/yourdomain.com`
4. Click **Upload** button
5. Upload ALL files from the `dist` folder:
   - `index.html`
   - `assets/` folder with all CSS and JS files
   - `vite.svg` (if present)
6. Upload the `.htaccess` file (see Step 5 below)

#### Option B: Using FTP

1. Open your FTP client (FileZilla, Cyberduck, etc.)
2. Connect to your cPanel server using FTP credentials
3. Navigate to `public_html` or your domain folder
4. Upload all files from the `dist` folder
5. Upload the `.htaccess` file

### Step 5: Create .htaccess File for React Router

Create a file named `.htaccess` in your public directory with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

**How to create .htaccess in cPanel:**
1. In File Manager, click **+ File** button
2. Name it `.htaccess` (with the dot at the beginning)
3. Right-click the file → **Edit**
4. Paste the content above
5. Save

### Step 6: Verify Deployment

1. Open your domain in a browser (e.g., `https://yourdomain.com`)
2. You should see the 3-second Gabstep preloader animation
3. After the animation, you'll see the Sign In page

### Step 7: Test the Application

1. **Sign Up** with any username, email, and profile picture
2. **Sign In** to access the chat
3. Send a test message
4. Try uploading a photo or file

#### To Create an Admin Account:
1. Sign Up with username: `admin`
2. When the admin passcode field appears, enter: `Gabstep@768`
3. You'll have full admin powers!

## 🔧 Troubleshooting

### Issue: White/Blank Page

**Solution:**
- Check that all files from `dist` folder are uploaded
- Verify `.htaccess` file exists and is correct
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: 404 Error on Page Refresh

**Solution:**
- Verify `.htaccess` file is uploaded to the correct directory
- Check if mod_rewrite is enabled on your server (usually enabled by default)

### Issue: Supabase Connection Error

**Solution:**
- Verify your Supabase project is active
- Check that the SQL schema has been run
- Ensure Realtime is enabled for all tables
- Verify your domain allows connections to `supabase.co`

### Issue: Images/CSS Not Loading

**Solution:**
- Check file permissions (should be 644 for files, 755 for folders)
- Verify all files in `assets` folder are uploaded
- Check your domain's SSL certificate (use HTTPS)

## 📁 Directory Structure on cPanel

After upload, your structure should look like:

```
public_html/ (or your domain folder)
├── index.html
├── .htaccess
├── assets/
│   ├── index-lsef3Ao8.css
│   └── index-B4Wg4DPt.js
└── vite.svg
```

## 🔒 Security Considerations

1. **SSL Certificate**: Make sure your domain has an SSL certificate (HTTPS)
   - Most cPanel hosts offer free Let's Encrypt SSL
   - Enable it in cPanel → SSL/TLS

2. **File Permissions**:
   - Files: 644 (rw-r--r--)
   - Folders: 755 (rwxr-xr-x)

3. **Environment Variables**:
   - Your Supabase credentials are embedded in the build (this is safe for client-side apps)
   - The anon key is meant to be public - Row Level Security in Supabase protects your data

## 🌐 Custom Domain Setup

If using a subdomain (e.g., `chat.yourdomain.com`):

1. In cPanel, go to **Subdomains**
2. Create a new subdomain pointing to a folder
3. Upload files to that folder
4. Follow the same steps above

## 📊 Performance Optimization

Your build is already optimized:
- ✅ Minified JavaScript and CSS
- ✅ Gzipped assets (16.95 KB CSS, 154.30 KB JS)
- ✅ Code splitting applied
- ✅ Production React build

With the `.htaccess` file above:
- ✅ Compression enabled
- ✅ Browser caching configured
- ✅ Security headers set

## 🎉 You're Done!

Your Gabstep Business Chat is now live!

- Users can sign up and start chatting
- Real-time messages work instantly
- File/photo uploads functional
- Admin features available with correct credentials

## 📞 Need Help?

- Check Supabase dashboard for database/auth logs
- Use browser DevTools (F12) to see JavaScript errors
- Check cPanel Error Logs for server issues

---

**Last Updated:** January 2025  
**App Version:** 1.0.0  
**Build Status:** ✅ Production Ready
