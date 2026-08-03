const http = require('http');

const PORT = process.env.PORT || 8080;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InvestPro - Premium Investment Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fef3c7 100%);
            line-height: 1.6;
        }
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid #fed7aa;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: bold;
            background: linear-gradient(135deg, #f97316, #ea580c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #f97316, #ea580c);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .header-buttons {
            display: flex;
            gap: 1rem;
        }
        .btn {
            padding: 0.6rem 1.5rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        .btn-primary {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(249, 115, 22, 0.3);
        }
        .btn-ghost {
            background: transparent;
            color: #f97316;
            border: 1px solid #f97316;
        }
        .btn-ghost:hover {
            background: #fff7ed;
        }
        .hero {
            max-width: 1200px;
            margin: 0 auto;
            padding: 4rem 2rem;
            text-align: center;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            color: #1f2937;
        }
        .gradient-text {
            background: linear-gradient(135deg, #f97316, #ea580c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 2rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 3rem;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 0;
        }
        .stat {
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            background: linear-gradient(135deg, #f97316, #ea580c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .stat-label {
            color: #6b7280;
            font-size: 0.875rem;
        }
        .features {
            background: white;
            padding: 4rem 2rem;
        }
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #1f2937;
        }
        .section-subtitle {
            text-align: center;
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 3rem;
        }
        .features-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        .feature-card {
            text-align: center;
            padding: 2rem;
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s;
        }
        .feature-card:hover {
            transform: translateY(-5px);
        }
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f97316, #ea580c);
            border-radius: 15px;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }
        .feature-title {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .feature-desc {
            color: #6b7280;
        }
        .plans {
            max-width: 1200px;
            margin: 4rem auto;
            padding: 0 2rem;
        }
        .plans-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .plan-card {
            background: linear-gradient(135deg, #fff 0%, #fff7ed 100%);
            border: 2px solid #fed7aa;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s;
        }
        .plan-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(249, 115, 22, 0.2);
        }
        .plan-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            border-radius: 20px;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .plan-amount {
            font-size: 2.5rem;
            font-weight: bold;
            color: #f97316;
            margin: 1rem 0;
        }
        .plan-label {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
        }
        .plan-details {
            margin: 1.5rem 0;
            text-align: left;
        }
        .plan-detail {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #fed7aa;
        }
        .plan-detail-label {
            color: #6b7280;
        }
        .plan-detail-value {
            font-weight: bold;
        }
        .value-green {
            color: #059669;
        }
        .value-orange {
            color: #f97316;
        }
        .cta-section {
            background: linear-gradient(135deg, #f97316, #ea580c);
            padding: 4rem 2rem;
            text-align: center;
            color: white;
        }
        .cta-section h2 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
        }
        .cta-section p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .btn-cta {
            background: white;
            color: #f97316;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1.125rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3);
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 3rem 2rem;
        }
        .footer-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        .footer-section h3 {
            margin-bottom: 1rem;
            font-weight: bold;
        }
        .footer-section ul {
            list-style: none;
        }
        .footer-section ul li {
            margin-bottom: 0.5rem;
        }
        .footer-section ul li a {
            color: #9ca3af;
            text-decoration: none;
            font-size: 0.875rem;
        }
        .footer-section ul li a:hover {
            color: white;
        }
        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid #374151;
            color: #9ca3af;
            font-size: 0.875rem;
        }
        @media (max-width: 768px) {
            h1 { font-size: 2rem; }
            .stats { grid-template-columns: 1fr; }
            .header-buttons { gap: 0.5rem; }
            .btn { padding: 0.5rem 1rem; font-size: 0.875rem; }
            .cta-buttons { flex-direction: column; align-items: stretch; }
            .section-title { font-size: 1.75rem; }
            .cta-section h2 { font-size: 1.75rem; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">
                <div class="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
                InvestPro
            </div>
            <div class="header-buttons">
                <button class="btn btn-ghost" onclick="showAlert('Login')">Login</button>
                <button class="btn btn-primary" onclick="showAlert('Register')">Get Started</button>
            </div>
        </div>
        <!-- Top Menu Bar -->
        <div style="border-top: 1px solid #fed7aa; background: rgba(255, 247, 237, 0.5);">
            <div class="header-content" style="padding: 0.75rem 2rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-ghost" style="padding: 0.4rem 1rem; font-size: 0.875rem;" onclick="showAlert('Recharge')">💳 Recharge</button>
                    <button class="btn btn-ghost" style="padding: 0.4rem 1rem; font-size: 0.875rem;" onclick="showAlert('Withdraw')">📤 Withdraw</button>
                    <button class="btn btn-ghost" style="padding: 0.4rem 1rem; font-size: 0.875rem;" onclick="showAlert('Channels')">📡 Channels</button>
                    <button class="btn btn-ghost" style="padding: 0.4rem 1rem; font-size: 0.875rem;" onclick="showAlert('Support')">💬 Support</button>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <h1>
            Start Earning <span class="gradient-text">Daily Income</span><br>
            From Your Investments
        </h1>
        <p class="subtitle">
            Join thousands of investors earning guaranteed daily returns with our premium VIP & SVIP investment plans
        </p>
        <div class="cta-buttons">
            <button class="btn btn-primary" onclick="showAlert('Register')">Start Investing →</button>
            <button class="btn btn-ghost" onclick="showAlert('View Plans')">View Plans</button>
        </div>
        
        <!-- Stats -->
        <div class="stats">
            <div class="stat">
                <div class="stat-value">10K+</div>
                <div class="stat-label">Active Investors</div>
            </div>
            <div class="stat">
                <div class="stat-value">₹50Cr+</div>
                <div class="stat-label">Total Invested</div>
            </div>
            <div class="stat">
                <div class="stat-value">₹5Cr+</div>
                <div class="stat-label">Earnings Paid</div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features">
        <h2 class="section-title">Why Choose InvestPro?</h2>
        <p class="section-subtitle">The most trusted investment platform in India</p>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">📈</div>
                <h3 class="feature-title">Daily Income</h3>
                <p class="feature-desc">Earn guaranteed daily returns on your investments</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🛡️</div>
                <h3 class="feature-title">100% Secure</h3>
                <p class="feature-desc">Bank-level security for your funds and data</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">👥</div>
                <h3 class="feature-title">Referral Rewards</h3>
                <p class="feature-desc">Earn up to 17% commission on 3 levels</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Instant Withdrawal</h3>
                <p class="feature-desc">Withdraw your earnings anytime, anywhere</p>
            </div>
        </div>
    </section>

    <!-- Plans Section -->
    <section class="plans">
        <h2 class="section-title">Popular Investment Plans</h2>
        <p class="section-subtitle">Choose the perfect plan for your investment goals</p>
        
        <div class="plans-grid">
            <div class="plan-card">
                <div class="plan-badge">VIP 1</div>
                <div class="plan-amount">₹550</div>
                <div class="plan-label">Investment Amount</div>
                <div class="plan-details">
                    <div class="plan-detail">
                        <span class="plan-detail-label">Daily Income</span>
                        <span class="plan-detail-value value-green">₹120</span>
                    </div>
                    <div class="plan-detail">
                        <span class="plan-detail-label">Total Return</span>
                        <span class="plan-detail-value value-orange">₹12,000</span>
                    </div>
                    <div class="plan-detail">
                        <span class="plan-detail-label">Validity</span>
                        <span class="plan-detail-value">100 Days</span>
                    </div>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="showAlert('Invest VIP 1')">Invest Now</button>
            </div>
            
            <div class="plan-card">
                <div class="plan-badge">VIP 2</div>
                <div class="plan-amount">₹1,500</div>
                <div class="plan-label">Investment Amount</div>
                <div class="plan-details">
                    <div class="plan-detail">
                        <span class="plan-detail-label">Daily Income</span>
                        <span class="plan-detail-value value-green">₹300</span>
                    </div>
                    <div class="plan-detail">
                        <span class="plan-detail-label">Total Return</span>
                        <span class="plan-detail-value value-orange">₹30,000</span>
                    </div>
                    <div class="plan-detail">
                        <span class="plan-detail-label">Validity</span>
                        <span class="plan-detail-value">100 Days</span>
                    </div>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="showAlert('Invest VIP 2')">Invest Now</button>
            </div>
            
            <div class="plan-card">
                <div class="plan-badge">VIP 3</div>
                <div class="plan-amount">₹3,000</div>
                <div class="plan-label">Investment Amount</div>
                <div class="plan-details">
                    <div class="plan-detail">
                        <span class="plan-detail-label">Daily Income</span>
                        <span class="plan-detail-value value-green">₹700</span>
                    </div>
                    <div class="plan-detail">
                        <span class="plan-detail-label">Total Return</span>
                        <span class="plan-detail-value value-orange">₹70,000</span>
                    </div>
                    <div class="plan-detail">
                        <span class="plan-detail-label">Validity</span>
                        <span class="plan-detail-value">100 Days</span>
                    </div>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="showAlert('Invest VIP 3')">Invest Now</button>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <h2>Ready to Start Earning Daily Income?</h2>
        <p>Join thousands of investors already earning with InvestPro</p>
        <button class="btn-cta" onclick="showAlert('Create Account')">Create Free Account →</button>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-grid">
            <div class="footer-section">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                    <div class="logo-icon" style="width: 32px; height: 32px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span style="font-size: 1.25rem; font-weight: bold;">InvestPro</span>
                </div>
                <p style="color: #9ca3af; font-size: 0.875rem;">Premium investment platform with guaranteed daily returns</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#" onclick="showAlert('Register'); return false;">Register</a></li>
                    <li><a href="#" onclick="showAlert('Login'); return false;">Login</a></li>
                    <li><a href="#" onclick="showAlert('Plans'); return false;">Plans</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Support</h3>
                <ul>
                    <li><a href="#" onclick="showAlert('Help Center'); return false;">Help Center</a></li>
                    <li><a href="#" onclick="showAlert('Contact'); return false;">Contact Us</a></li>
                    <li><a href="#" onclick="showAlert('FAQs'); return false;">FAQs</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Legal</h3>
                <ul>
                    <li><a href="#" onclick="showAlert('Terms'); return false;">Terms of Service</a></li>
                    <li><a href="#" onclick="showAlert('Privacy'); return false;">Privacy Policy</a></li>
                    <li><a href="#" onclick="showAlert('Refund'); return false;">Refund Policy</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 InvestPro. All rights reserved.</p>
        </div>
    </footer>

    <script>
        function showAlert(action) {
            alert('🎉 ' + action + ' - Demo Preview\\n\\nThis is a PREVIEW version showing the home page design.\\n\\nTo enable FULL functionality:\\n\\n1. Complete: npm install\\n2. Generate: npx prisma generate\\n3. Database: npx prisma db push\\n4. Seed data: npm run db:seed\\n5. Start server: npm run dev\\n\\nThen all buttons will work with real authentication, database, and features!');
        }
    </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
});

server.listen(PORT, () => {
    console.log('\\n====================================');
    console.log('✅ SERVER IS RUNNING!');
    console.log('====================================');
    console.log(`🌐 Open your browser:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('====================================');
    console.log('📱 Home Page Preview is now showing!');
    console.log('\\nTo get FULL functionality:');
    console.log('1. Complete installation: npm install');
    console.log('2. Generate Prisma: npx prisma generate');  
    console.log('3. Setup database: npx prisma db push');
    console.log('4. Seed database: npm run db:seed');
    console.log('5. Start full server: npm run dev');
    console.log('====================================\\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`\\n❌ Port ${PORT} is already in use!`);
        console.log('Try: set PORT=3001 && node simple-server.js\\n');
    } else {
        console.error('Server error:', err);
    }
});
