define ['app'], (app) ->
  app.service "NotificationsStore", ($rootScope, $filter, NotificationsSimulator) ->

    this.error_sending_message = () -> this.getNotification 'error', 'notification_error_sending_message', 'active', false
    this.login_failed = () -> this.getNotification 'error', 'notification_login_failed', 'active', false
    this.wrong_email_or_password = () -> this.getNotification 'error', 'notification_wrong_email_or_password', 'active', false
    this.error_uploading_file = (error) -> this.getNotification 'error', 'notification_error_uploading_file', 'active', false, {'error': error}
    this.sms_sent = (phone) -> this.getNotification 'info', 'notification_sms_sent', 'active', false, {'phone': phone}
    this.another_sms_sent = () -> this.getNotification 'info', 'notification_another_sms_sent', 'active', false
    this.error_sending_message = () -> this.getNotification 'error', 'notification_error_sending_message', 'active', false
    this.success_confirm_registration = () -> this.getNotification 'success', 'notification_success_confirm_registration', 'active', false
    this.session_expired = () -> this.getNotification 'info', 'notification_session_expired', 'active', false
    this.success_upload = () -> this.getNotification 'success', 'notification_success_upload', 'active', false
    this.check_email = () -> this.getNotification 'info', 'notification_check_email', 'active', false
    this.error_updating_account = (error) -> this.getNotification 'error', 'notification_error_updating_account', 'active', false, {'error': error}
    this.account_updated = () -> this.getNotification 'success', 'notification_account_updated', 'active', false
    this.success_password_change = () -> this.getNotification 'success', 'notification_success_password_change', 'active', false
    this.fail_password_change = () -> this.getNotification 'error', 'notification_fail_password_change', 'active', false
    this.invalid_access_code = () -> this.getNotification 'error', 'notification_invalid_access_code', 'active', false
    this.missing_order_id = () -> this.getNotification 'error', 'notification_missing_order_id', 'active', false
    this.order_canceled = () -> this.getNotification 'error', 'notification_order_canceled', 'active', false
    this.total_order_error = () -> this.getNotification 'error', 'notification_total_order_error', 'active', false
    this.error_processing_order = () -> this.getNotification 'error', 'notification_error_processing_order', 'active', false
    this.market_order_unavailable = () -> this.getNotification 'info', 'notification_market_order_unavailable', 'active', false
    this.market_order_available_again = () -> this.getNotification 'info', 'notification_market_order_available_again', 'active', false
    this.buy_order_confirmed = () -> this.getNotification 'success', 'notification_buy_order_confirmed', 'active', true
    this.sell_order_confirmed = () -> this.getNotification 'success', 'notification_sell_order_confirmed', 'active', true
    this.something_went_wrong = () -> this.getNotification 'error', 'notification_something_went_wrong', 'active', false
    this.error_cancelling_order = () -> this.getNotification 'error', 'notification_error_cancelling_order', 'active', false
    this.congrats_please_register = () -> this.getNotification 'success', 'notification_congrats_please_register', 'active', false
    this.success_order_cancel = () -> this.getNotification 'success', 'notification_success_order_cancel', 'active', true
    this.password_reset_instructions_sent = (email) -> this.getNotification 'info', 'notification_password_reset_instructions_sent', 'active', false, {'email': email}
    this.signed_up_early_access = () -> this.getNotification 'success', 'notification_signed_up_early_access', 'active', false
    this.new_buy_order_processing = () -> this.getNotification 'info', 'notification_new_buy_order_processing', 'active', true
    this.new_sell_order_processing = () -> this.getNotification 'info', 'notification_new_sell_order_processing', 'active', true
    this.thanks = () -> this.getNotification 'info', 'notification_thanks', 'active', false
    this.deposits_sent = () -> this.getNotification 'success', 'notification_deposits_sent', 'active', true
    this.success_bank_account_verified = () -> this.getNotification 'success', 'notification_success_bank_account_verified', 'active', true
    this.success_bank_account_deleted = () -> this.getNotification 'info', 'notification_success_bank_account_deleted', 'active', true
    this.error_deleting_bank_account = () -> this.getNotification 'error', 'notification_error_deleting_bank_account', 'active', false
    this.success_logout = () -> this.getNotification 'info', 'notification_success_logout', 'active', false
    this.bank_account_should_be_funded = () -> this.getNotification 'success', 'notification_bank_account_should_be_funded', 'active', true
    this.buttercoin_account_should_be_funded = () -> this.getNotification 'success', 'notification_buttercoin_account_should_be_funded', 'active', true
    this.verification_request_received = () -> this.getNotification 'info', 'notification_verification_request_received', 'active', true


    this.getNotification = (type, message, displayMode, showInDropdown, params = {}) -> {
      id: Math.floor(Math.random() * 999999)
      title: this.postProcessMessage($filter('translate')(message, true), params)
      description: ''
      read: false
      type: type
      display: displayMode
      date: new Date().getTime()
      showInDropdown: showInDropdown
      button:
        title: ''
        url: ''
    }


    this.postProcessMessage = (message, params) ->
      message = message.replace /\[blue\]([^\[]*)\[\/blue\]/, '<span class="notif-blue">$1</span>'
      message = message.replace /\[green\]([^\[]*)\[\/green\]/, '<span class="notif-green">$1</span>'
      message = message.replace /(\$[^ ]+)/g, (key) -> params[key.slice(1)]
      return message
      

    return
    
  return