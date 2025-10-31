const MosyColumnFactory = {

   //-- account_urls cols--//
  account_urls: ["record_id", "url_name", "url", "description", "hive_site_id", "hive_site_name"],

   //-- billing_log cols--//
  billing_log: ["trx_key", "transaction_ref", "trx_type", "trx_time", "trx_source", "ref_id", "site_id", "message", "hive_site_id", "hive_site_name", "site_name", "user_id", "user_name", "running_balance", "cr", "dr"],

   //-- billing_transactions cols--//
  billing_transactions: ["trxkey", "trx_id", "trx_date", "trx_month_year", "trx_remark", "amount", "trx_type", "business_id", "client_id", "admin_id", "TransactionType", "BusinessShortCode", "BillRefNumber", "InvoiceNumber", "OrgAccountBalance", "ThirdPartyTransID", "MSISDN", "FirstName", "MiddleName", "LastName", "trx_msg", "account_id", "used_status", "filter_date", "flw_id", "flag_state", "reconciled", "corrected_number", "site_id", "site_name", "hive_site_id", "hive_site_name"],

   //-- clients cols--//
  clients: ["client_id", "client_name", "client_email", "client_tel", "client_location", "client_photo", "gender", "date_registered", "password", "admin_id", "hive_site_id", "hive_site_name"],

   //-- cloud_files cols--//
  cloud_files: ["filekey", "itemid", "remark", "photo", "dateuploaded", "hive_site_id", "hive_site_name"],

   //-- companies cols--//
  companies: ["company_id", "business_no", "name", "mobile", "email", "business_name", "location", "specialty", "remark", "logo", "bank_name", "account_no", "pin_no", "swort_code", "hive_site_id", "hive_site_name"],

   //-- hive_billing_user_accounts cols--//
  hive_billing_user_accounts: ["record_id", "user_id", "user_name", "hive_site_id", "hive_site_name", "cr", "dr", "account_status", "last_recharge", "bill_as_at", "remark", "site_name", "balance", "plan_id", "plan_name", "plan_amount", "expiry_date", "plan_duration", "billing_type"],

   //-- inventory cols--//
  inventory: ["record_id", "item_name", "quantity", "rate", "tax", "discount", "date_created", "item_remark", "hive_site_id", "hive_site_name"],

   //-- invoice_items cols--//
  invoice_items: ["record_id", "invoice_id", "item_id", "item_name", "quantity", "rate", "tax", "discount", "date_created", "account_context", "account_name", "item_key", "stock_type", "invoice_edit_key", "selling_price", "sale_state", "remaining_qty", "add_to_stock", "item_remark", "hive_site_id", "hive_site_name"],

   //-- invoice_payments cols--//
  invoice_payments: ["record_id", "invoice_id", "date_paid", "amount_paid", "balance", "ref_no", "payment_mode", "remark", "hive_site_id", "hive_site_name", "invoice_no"],

   //-- invoices cols--//
  invoices: ["invoice_id", "invoice_no", "date_created", "date_due", "paid_status", "created_by", "name", "invoice_stage", "remark", "client_id", "paid_on", "supplier_id", "invoice_type", "account_affect", "inv_no_int", "invoice_key", "client_name", "client_tel", "client_email", "invoice_amount", "hive_site_id", "hive_site_name", "vendor_headers", "client_headers", "vendor_name", "currency", "discount", "date_paid", "ref_no", "quotation", "date_updated", "folder", "footnote"],

   //-- lead_followup cols--//
  lead_followup: ["record_id", "lead_id", "followup_type", "followup_date", "status", "remark", "potential", "stage", "hive_site_id", "hive_site_name"],

   //-- leads_list cols--//
  leads_list: ["record_id", "name", "tel", "email", "lead_date", "source", "campaign", "cost", "potential", "stage", "tag", "remark", "hive_site_id", "hive_site_name"],

   //-- message_templates cols--//
  message_templates: ["record_id", "template_name", "message_subject", "message_template", "template_code", "hive_site_id", "hive_site_name"],

   //-- messaging cols--//
  messaging: ["messageid", "receiver_contacts", "receiver_tel", "receiver_email", "reciver_names", "message_type", "site_id", "group_name", "message_date", "sent_state", "msg_read_state", "subject", "message_label", "message_details", "sms_cost", "page_count", "hive_site_id", "hive_site_name", "custom_dictionary", "message_signature", "ref_number"],

   //-- mosy_sql_roll_back cols--//
  mosy_sql_roll_back: ["roll_bk_key", "table_name", "roll_type", "where_str", "roll_timestamp", "value_entries", "hive_site_id", "hive_site_name"],

   //-- page_manifest_ cols--//
  page_manifest_: ["manikey", "page_group", "site_id", "page_url", "hive_site_id", "hive_site_name"],

   //-- quick_notes cols--//
  quick_notes: ["record_id", "note_title", "note_date", "note_details", "note_tag", "folder_name", "dateupdated", "hive_site_id", "hive_site_name"],

   //-- sales_script cols--//
  sales_script: ["record_id", "title", "tag", "event", "reply_rate", "message", "lead_reply", "hive_site_id", "hive_site_name"],

   //-- system_users cols--//
  system_users: ["user_id", "name", "email", "tel", "login_password", "ref_id", "regdate", "user_no", "user_pic", "user_gender", "last_seen", "about", "hive_site_id", "hive_site_name", "auth_token", "token_status", "token_expiring_in"],

   //-- transactions cols--//
  transactions: ["trxkey", "trx_id", "trx_date", "trx_month_year", "trx_remark", "amount", "trx_type", "business_id", "client_id", "admin_id", "TransactionType", "BusinessShortCode", "BillRefNumber", "InvoiceNumber", "OrgAccountBalance", "ThirdPartyTransID", "MSISDN", "FirstName", "MiddleName", "LastName", "trx_msg", "account_id", "used_status", "filter_date", "flw_id", "flag_state", "reconciled", "corrected_number", "hive_site_id", "hive_site_name", "site_name"],

   //-- user_manifest_ cols--//
  user_manifest_: ["admin_mkey", "user_id", "user_name", "role_id", "site_id", "role_name", "hive_site_id", "hive_site_name"],


};
export default MosyColumnFactory;