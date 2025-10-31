import { loadTrxHistory } from '../mosybilling/PricingCards';


// sidebarConfig.js
export const sidebarConfig = [
    { type: "link", label: "Dashboard", icon: "fa fa-home", href: (routes) => `${routes.nextinvoice}/dashboard/main`, roles: [] },
  
    { type: "link", label: "Create invoice", icon: "fa fa-plus-circle", href: (routes) => `${routes.nextinvoice}/docs/invoiceprofile`, roles: [] },
    //{ type: "link", label: "Create Campaign", icon: "fa fa-check-circle", href: (routes) => `${routes.nextinvoice}/docs/invoiceprofile`, roles: [] },
  
    {
      type: "submenu",
      label: "Invoices",
      icon: "fa fa-copy",
      roles: [],
      items: [
        { label: "Create invoice", href: (routes) => `${routes.nextinvoice}/docs/invoiceprofile`, roles: [] },
        { label: "Manage invoices", href: (routes) => `${routes.nextinvoice}/docs/invoices`, roles: [] },
      ],
    },
  
    {
      type: "submenu",
      label: "Quotations",
      icon: "fa fa-file-text",
      roles: [],
      items: [
        { label: "Create quotation", href: (routes) => `${routes.nextinvoice}/docs/quotation`, roles: [] },
        { label: "Manage Quotations", href: (routes) => `${routes.nextinvoice}/docs/quotations`, roles: [] },
      ],
    },
  
    {
      type: "submenu",
      label: "Items",
      icon: "fa fa-list",
      roles: [],
      items: [
        { label: "Add item", href: (routes) => `${routes.nextinvoice}/pns/profile`, roles: [] },
        { label: "Manage items", href: (routes) => `${routes.nextinvoice}/pns/list`, roles: [] },
      ],
    },
  
    {
      type: "submenu",
      label: "Clients",
      icon: "fa fa-users",
      roles: [],
      items: [
        { label: "Add client", href: (routes) => `${routes.nextinvoice}/clients/profile`, roles: [] },
        { label: "Manage clients", href: (routes) => `${routes.nextinvoice}/clients/list`, roles: [] },
      ],
    },
  
    {
      type: "submenu",
      label: "My businesses",
      icon: "fa fa-briefcase",
      roles: [],
      items: [
        { label: "Add company", href: (routes) => `${routes.nextinvoice}/vendors/business`, roles: [] },
        { label: "Manage companies", href: (routes) => `${routes.nextinvoice}/vendors/businesslist`, roles: [] },
      ],
    },
  
    {
      type: "submenu",
      label: "Payments",
      icon: "fa fa-credit-card",
      roles: [],
      items: [
        { label: "Add payment", href: (routes) => `${routes.nextinvoice}/payments/profile`, roles: [] },
        { label: "Manage Payments", href: (routes) => `${routes.nextinvoice}/payments/list`, roles: [] },
      ],
    },
  
    {
      type: "submenu",
      label: "Notifications",
      icon: "fa fa-envelope",
      roles: [],
      items: [
        { label: "Send message", href: (routes) => `${routes.nextinvoice}/reminders/message`, roles: [] },
        { label: "Manage messages", href: (routes) => `${routes.nextinvoice}/reminders/messages`, roles: [] },
        { label: "Message templates", href: (routes) => `${routes.nextinvoice}/messagetemplates/list`, roles: [] },
        { label: "Message settings", href: (routes) => `${routes.nextinvoice}/sysconfigs/list`, roles: [] },
      ],
    },
  
    {
      type: "submenu",
      label: "Lead Management",
      icon: "fa fa-edit",
      roles: [],
      items: [
        { label: "Add lead", href: (routes) => `${routes.nextinvoice}/leads_list/profile`, roles: [] },
        { label: "Manage leads", href: (routes) => `${routes.nextinvoice}/leads_list/list`, roles: [] },
        { label: "Lead Followups", href: (routes) => `${routes.nextinvoice}/lead_followup/list`, roles: [] },
        { label: "My Documents", href: (routes) => `${routes.nextinvoice}/quick_notes/list`, roles: [] },
      ],
    },
  
    { type: "action", label: "Billing", icon: "fa fa-database", onClick: () => loadTrxHistory(), roles: [] },
  
    { type: "link", label: "My account", icon: "fa fa-shield", href: (routes) => `${routes.nextinvoice}/accounts/list`, roles: [] },
  ];
  