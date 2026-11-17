# Privacy implementation review — 17 November 2026

Status: committee approved the policy changes on 17 November 2026. Committee will notify affected users. Public draft labels removed. Technical verification items below remain open; approval is not evidence that those technical checks have passed. No database permissions, retention jobs, public routes or storage permissions have been changed by this work.

## Decisions needed
- Confirm the controller and contracting organiser with the Guild; do not assume the society is a separate legal entity or that the Guild controls this independent site.
- Confirm the privacy/complaints mailbox and responsible committee officer, with cover during handover.
- Identify ticket seller, payment processor, cancellation/refund conditions and responsibility for refunds.
- Approve processing purposes and lawful bases, document legitimate-interest assessments where appropriate.
- Establish additional conditions before collecting health/accessibility or other special-category data.
- Confirm authorised organisers: current elected committee only, or any limited delegated access?
- Confirm each provider, processing role, region, subprocessors, international access and UK transfer safeguards.
- Approve category-specific retention periods and actual deletion procedures (database, storage, exports, backups).

## Source audit findings
- Public app directly inserts answers into form_submissions. Duplicate-email prevention selects an existing submission ID. Check anonymous RLS: it must not expose other respondents or permit enumeration; move duplicate detection behind a safe server boundary if needed.
- Form uploads and competition images call getPublicUrl. Audit actual bucket public flags and policies. Separate intentionally published competition media from private registration uploads. Private storage requires coordinated signed access changes and migration of existing public objects; changing the helper alone is insufficient.
- Admin app has /forms/[id]/results and export functionality. Inspect server authorization, response data, caches, exports and APIs before claiming committee-only access. Field masking in rendered HTML is not authorization.
- Public app also has competition entries, ratings, leaderboards and event photo galleries. Verify publication notices, permissions and removal procedures.
- No dedicated analytics integration found in public source search. A sidebar component writes sidebar:state for seven days, but actual use on public routes needs verification. Supabase client uses default auth options. Audit live cookies/storage, hosting injection, network requests and request-log retention.
- Existing general form notice incorrectly treated submission as agreement to the privacy policy. Replaced with an informational notice; added a notice to competition registration.
- No evidence reviewed of automatic retention deletion, consent/version recording, a complaints register or reviewed international-transfer arrangements. Do not describe these as already implemented.

## Operational checklist before approval
1. Verify access as anonymous, ordinary authenticated user, committee admin and former committee member. Test exported payloads, not just visible cells.
2. Review all active form fields; minimise student IDs and sensitive free text. Explain mandatory fields. Prefer individual invitations for pair registrations.
3. Set public publication rules for competition entries, ratings and media, including image removal workflow.
4. Maintain processing/provider and retention registers. Assign deletion owners and review dates; cover local spreadsheets and backups.
5. Establish complaints intake: acknowledge within 30 days, investigate and communicate outcome without undue delay. Keep rights requests separate, normally one month subject to lawful exceptions/extensions.
6. Establish breach assessment/escalation and committee access handover. Check ICO fee applicability with the responsible controller. Assess whether any activity requires a DPIA.
7. Add purpose-specific optional consent only where actually used; store wording/version, timestamp and withdrawal. Do not bundle marketing with registration.
8. Once terms are approved, implement proportionate registration acceptance and terms-version evidence where contract acceptance is needed. Do not add acceptance for this unapproved draft or put metadata into public answers.
9. Replace all draft statements with verified facts, add effective dates, obtain Guild/committee review, and test mobile navigation and policy links before release.

## Sources
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/
- https://ico.org.uk/for-organisations/how-to-deal-with-data-protection-complaints/what-do-we-do-when-we-receive-a-complaint/
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-are-the-rules-on-special-category-data/
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/
- https://www.guildofstudents.com/privacy-policy/studentprivacypolicynotice/
- https://www.legislation.gov.uk/uksi/2013/3134/2026-01-01?wrap=true
- https://www.legislation.gov.uk/ukpga/2015/15/enacted

## Confirmed after Guild policy research and committee response
- Society privacy requests/complaints mailbox confirmed: uzbeksociety@guild.bham.ac.uk.
- Guild generally manages paid ticketing, merchandise transactions and refunds. Check the actual seller per transaction. Do not apply ticket cancellation clauses to merchandise returns.
- Identifiable form results and Excel downloads: current lawfully elected committee only, specifically authorised by role and purpose; not blanket access for all members. User confirms existing access control. Server-side verification remains a separate audit task, not an assumption that controls are absent.
- Read Guild Student Groups Privacy Statement (updated 2 December 2025), Student Privacy Notice (26 August 2026), Data Security Policy (30 July 2026) and ticket terms. Student-group statement supplies DPO contact, retention framework and consent-based promotional media provisions.
- Group statement says generally retain member data during membership; committee name/role up to seven years; ordinary consent-based digital promotional images maximum five years. These are not reasons to retain every event answer for those periods. Map data categories and automate deletion appropriately.
- The statement describes Guild databases/MSL, not this independently configured Supabase service. Public material does not conclusively establish controller/processor responsibility or approval for that separate system. Do not copy Guild firewall, training or hosting claims as verified website facts.
- Source: https://www.guildofstudents.com/privacy-policy/studentgroupsprivacynotice/
- Source: https://www.guildofstudents.com/privacy-policy/data-security-policy/
- Source: https://www.guildofstudents.com/tac/

## Approved academic-year retention rule
User confirmed: retain event registration, voting and form information until the end of the academic year of collection. Outgoing committee must delete results and private information, uploads and exported copies, even if re-elected. Preserve non-private event details permanently in the archive. Implement and verify deletion across systems; this policy edit does not itself delete data. Specific legal retention requirements and provider backup expiry are handled separately.
