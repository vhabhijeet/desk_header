import frappe

@frappe.whitelist()
def debug_user_company():
    try:
        user = frappe.session.user
        default_company = frappe.db.get_value('User', user, 'default_company')
        
        frappe.logger().info(f"Debug - User: {user}")
        frappe.logger().info(f"Debug - Default Company: {default_company}")
        
        return {
            'success': True,
            'user': user,
            'default_company': default_company
        }
    except Exception as e:
        frappe.logger().error(f"Debug Error: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }
