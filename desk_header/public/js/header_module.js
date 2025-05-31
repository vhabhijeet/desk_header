frappe.provide('frappe.ui.navbar');

(function() {
    function addCompanyDisplay() {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'User',
                filters: { 'name': frappe.session.user },
                fieldname: ['default_company']
            },
            callback: (response) => {
                if (response && response.message) {
                    const defaultCompany = response.message.default_company;
                    if (defaultCompany) {
                        displayCompany(defaultCompany);
                    }
                }
            }
        });
    }

    function displayCompany(companyName) {
        // Create company display element
        let companyDisplay = document.createElement('div');
        companyDisplay.classList.add('custom-company-display', 'navbar-center');
        
        // Style to center the text
        companyDisplay.style.cssText = `
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-weight: bold;
            color: var(--text-color);
        `;

        // Only set the company name without any prefix
        companyDisplay.textContent = companyName;

        // Find the navbar container
        const navbarContainer = document.querySelector('.navbar');
        
        if (navbarContainer) {
            // Ensure it's positioned correctly
            navbarContainer.style.position = 'relative';
            
            // Remove any existing company display
            const existingDisplay = document.querySelector('.custom-company-display');
            if (existingDisplay) {
                existingDisplay.remove();
            }

            // Add the new company display
            navbarContainer.appendChild(companyDisplay);
        }
    }

    // Wait for the document to be ready
    $(document).ready(() => {
        // Attempt to add company display with retry mechanism
        const maxRetries = 5;
        let retryCount = 0;

        function attemptAddCompanyDisplay() {
            try {
                addCompanyDisplay();
            } catch (error) {
                console.error('Desk Header: Initialization Error', error);
                
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(attemptAddCompanyDisplay, 1000 * retryCount);
                } else {
                    console.error('Desk Header: Failed to add company display after multiple attempts');
                }
            }
        }

        attemptAddCompanyDisplay();
    });
})();
