# Public MVP QA and Launch Checklist

## Account

- [ ] User can register
- [ ] User can log in
- [ ] User can log out
- [ ] User can reset password
- [ ] User can access dashboard
- [ ] No MagicAI/Biolink/vendor branding visible in customer account flows

## Podlink page

- [ ] User can create a unique handle
- [ ] Duplicate handles are blocked
- [ ] User can edit profile/show name
- [ ] User can add links
- [ ] User can add embeds if supported
- [ ] User can publish page
- [ ] Public page loads at `podlink.fm/{handle}`
- [ ] Invalid handle returns clean 404
- [ ] Public page looks good on mobile
- [ ] Podlink branding appears on Free tier
- [ ] Branding can be removed on paid tier if implemented

## AI Content Kit

- [ ] Episode descriptions generate correctly
- [ ] YouTube titles/descriptions/tags work if enabled
- [ ] Social captions work if enabled
- [ ] Newsletter copy works if enabled
- [ ] Show notes/summaries work if enabled
- [ ] Usage limits/plan gates are respected

## AI Clip Studio

- [ ] Viral Clips exists and works if enabled
- [ ] AI Captions works if enabled
- [ ] Video Editor works if enabled
- [ ] Outputs can be downloaded/exported
- [ ] Usage limits are clear
- [ ] Errors are handled gracefully

## Publishing

- [ ] Social connection flow works if enabled
- [ ] Schedule/publish flow works if enabled
- [ ] If publishing is not reliable, hide it from launch UI

## Website

- [ ] `podlink.ai` homepage loads
- [ ] Pricing page loads
- [ ] Feature pages load
- [ ] CTAs route to `app.podlink.ai/register`
- [ ] Login routes to `app.podlink.ai/login`
- [ ] Terms/privacy/contact exist
- [ ] Analytics page clearly says coming soon if not built
- [ ] SEO/meta/Open Graph fields are present

## Billing

- [ ] Free plan exists
- [ ] Paid plans exist in test mode
- [ ] Upgrade flow works in test mode
- [ ] Billing page loads
- [ ] Locked features route to billing/upgrade
- [ ] No duplicate Biolink billing visible

## Security / production sanity

- [ ] `.env` secrets are not committed
- [ ] production `APP_DEBUG=false`
- [ ] admin routes are protected
- [ ] file uploads are restricted by file type/size
- [ ] SSO tokens expire quickly if bridge is used
- [ ] HTTPS active
- [ ] database backups planned
- [ ] rollback plan exists

## Final founder review

- [ ] pricing approved
- [ ] copy approved
- [ ] feature promises accurate
- [ ] brand acceptable for beta
- [ ] launch decision approved
