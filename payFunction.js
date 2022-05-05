export const payToken = (cartId, token, campaignPurchase, crmSalereference, userId, cardId, cvv, msi, billData, orderDetails, jobId, origin, dispatch, store, setModalError, setShowRedirectionModal) => {
    const { dataLayer } = window;
    if (dataLayer !== undefined) transactionAttempt(userId, cartId, orderDetails.subTotal, 'token', dataLayer);
    const query = {
      cartId, token, cardId, cvv, msi, campaignPurchase: campaignPurchase || '', crmSalereference: crmSalereference || '', billData, appUrl: `${appUrl}/checkout`, migratedAccount: store.migration.migratedAccount,
    };
    const url = `${appUrl}${internalApi.payToken.replace(':userId', userId)}`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    };
    addPendingResponse(pendingResponseTypes.cartPurchase, dispatch, store);
    fetch(url, options).then((res) => {
      res.json().then((resJson) => {
        if (res.status !== 201) {
          const { description, error_code } = resJson;
          setModalError(description, String(error_code));
        } else {
          const { purchaseId, statusDescription, paymentMethodName } = resJson;
          if (resJson.redirect_url) {
            setShowRedirectionModal(true);
            setTimeout(() => {
              window.location.replace(resJson.redirect_url);
            }, 5000);
            return;
          }
          removeCookie(cookieCampaignPurchase);
          removeCookie(cookieCart);
          removeCookie(cookieSfTracking);
          const redirectUrl = getReceiptRedirectUrl(jobId, origin, purchaseId, statusDescription, paymentMethodName);
          window.location.replace(redirectUrl);
        }
      });
    }).catch(() => { setModalError('', '1000'); }).then(() => {
      removePendingResponse(pendingResponseTypes.cartPurchase, dispatch, store);
    });
  }