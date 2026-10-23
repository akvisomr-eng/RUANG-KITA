# RUANG KITA Android App — Product & Technical Plan

## Product decision

Build RUANG KITA as an Android application, not merely a website wrapped in an APK. Reuse the existing Next.js platform and authenticated room APIs where appropriate, while introducing a native Android capability layer for media capture, device routing, sensors, notifications, and background operation.

**Initial implementation strategy:** a staged hybrid Android app. Keep the current web platform as the shared creator workspace; package the mobile experience with Capacitor only after the responsive mobile UI and web APIs are stable. Add purpose-built Android plugins/modules for features that require native lifecycle or hardware access. Do not claim native functionality until a real Android build and device test pass.

## Experience principles

- Dark, cinematic studio surface with restrained cyan/violet accents, large readable typography, strong contrast, and subtle motion.
- A persistent bottom navigation on phones: **Studio**, **Ruang**, **Avatar**, **Media**, **Profil**. Use a side rail/navigation drawer on tablets and landscape layouts.
- Studio home prioritizes one main action: **Mulai produksi**. Secondary actions: Buat ruang, Gabung sebagai tamu, Uji perangkat.
- During a live session, keep mic/camera, switch camera, speaker route, scene, participants, connection quality, and leave/end controls reachable with one hand. Destructive actions require confirmation.
- Show clear permission rationale before asking for camera, microphone, notifications, nearby devices, or media access.
- Provide audio-first fallback for weak networks, no camera, or denied camera permission.
- Respect Android system theme, font scaling, display cutouts, gesture navigation, and accessibility semantics.
- Keep animation GPU-conscious; reduce motion when Android accessibility settings request it.

## Android capabilities and intended use

| Capability | Intended feature | Guardrails |
| --- | --- | --- |
| Camera / CameraX | Front/back camera, framing, photo/video capture, camera health check | Request only when user starts camera or capture; visible camera state |
| Microphone / AudioRecord | Voice capture, input-level meter, monitoring and local audio capture | Explicit permission; visible mute/recording state; no hidden capture |
| Bluetooth / audio routing | Headsets, earbuds, external microphones and speaker selection | Ask Android for nearby-device permission only where required; handle route changes |
| Accelerometer / gyroscope | Optional horizon/framing aid, gentle avatar/scene motion, orientation adaptation | Opt-in, sampled sparingly, no continuous tracking by default |
| Orientation / display metrics | Portrait/landscape layout and camera framing | Follow system orientation unless the user explicitly locks a supported production layout |
| Notifications | Guest invitations, scheduled session reminders, room status | User-controlled channels; no sensitive room content on lock screen by default |
| Haptics | Subtle feedback for mute, scene change, and recording start/stop | Respect vibration settings; never rely on haptics as the only signal |
| MediaProjection (later) | Screen sharing/tutorial capture | System consent prompt every required session; clear sharing indicator and stop control |
| Foreground service (later) | Continue an explicitly started live session or recording when app is backgrounded | Android-version-specific service types/permissions, persistent notification, explicit stop |
| Share sheet / deep links | Invite guests, share published clips, open room invitations | Short-lived invitation tokens; avoid exposing private room IDs unnecessarily |
| Local storage | Draft exports and offline setup assets | Scoped storage, user-visible export, retention controls; encrypt sensitive app-managed data where appropriate |
| Network state | Show Wi-Fi/mobile connectivity and adapt media quality | Do not collect location; network status is not a guarantee of bandwidth |
| BiometricPrompt (optional) | App-lock / local re-authentication for sensitive workspace access | Never use biometrics as a replacement for server authorization |

**Not planned by default:** location, contacts, SMS, call logs, or always-on background microphone. They are not necessary for core podcast production and should not be requested.

## Proposed app architecture

1. **Android shell:** Capacitor for reuse of the responsive web experience and shared navigation, with a small native plugin layer for Android-only features.
2. **Native modules:** Kotlin modules for device diagnostics, audio route reporting, haptics, lifecycle/foreground session coordination, and CameraX integration when browser media APIs prove insufficient.
3. **Media plane:** WebRTC for interactive room media with an SFU provider selected only after pricing, limits, Android compatibility, and load tests. Media must not depend on AI calls.
4. **Backend:** retain the existing Next.js server endpoints and Neon development branch while auth, tenant ownership, room roles, invitation expiry, quotas, and audit logging are verified. Never ship database credentials or privileged tokens in the APK.
5. **AI:** asynchronous producer suggestions and post-session summaries; AI does not automatically publish, record, invite participants, or change a live scene without explicit host approval.
6. **Build/release:** Android debug APK first, then signed release/AAB only after CI, dependency/license review, privacy review, and real-device smoke tests.

## UI map

- **Studio:** next session, quick actions, device test, recent rooms, connection readiness.
- **Ruang:** create room, join via invitation, room schedule, roles, access and waiting room.
- **Live Studio:** stage preview, audio meter, mic/camera, camera flip, scene switcher, guest tiles, connection quality, record/live status, end-session safety.
- **Avatar:** choose licensed avatar, voice, expression and motion; consent and asset provenance for realistic likeness.
- **Media:** local drafts, exports, generated assets, upload queue and storage quota.
- **AI Co-Producer:** agenda, question prompts, captions/translation and post-production suggestions, always host-controlled.
- **Profile & Settings:** account, privacy, permissions, connected audio devices, data export/delete, accessibility and notification controls.

## Free-tier-first delivery gates

### Gate A — mobile foundation
- Responsive phone layouts and accessible navigation.
- Installable PWA behavior where supported.
- Document and verify a Capacitor Android build path.
- Add permission education and device-check UX before hardware integration.

### Gate B — Android prototype
- Generate Android project; debug build succeeds.
- Install and smoke-test on at least one physical Android device.
- Verify camera/microphone permission grant/deny/revoke flows, app background/foreground, audio route changes, and orientation.
- Test a range of Android versions before declaring broad compatibility.

### Gate C — room connectivity
- Sign-in and session persistence tested on device.
- Room creation/joining and server-side ownership/role checks tested with two accounts.
- WebRTC audio/video, reconnect, mute, camera switch, and network loss tested on real devices.
- No production database migration or deployment before staging tests pass.

### Gate D — recording and release
- Explicit consent, persistent recording indication, stop/recovery behavior, storage quota and deletion tested.
- Foreground-service and screen-sharing behavior validated against target Android SDK rules.
- Accessibility, battery/thermal behavior, privacy policy, dependency licenses, signed APK/AAB, and release checklist completed.

## Acceptance checklist (not yet verified)

- [ ] Android project generated and builds successfully.
- [ ] APK installed and launched on a physical device.
- [ ] Sign-in and session restoration verified.
- [ ] Camera and microphone permissions verified for allow, deny, and later revoke.
- [ ] Headset/Bluetooth route changes verified.
- [ ] Background/foreground lifecycle tested without hidden recording.
- [ ] Room create/join tested with two accounts.
- [ ] Real-time media and reconnection tested.
- [ ] Accessibility, battery, privacy, and license checks passed.
- [ ] Signed release build produced and reviewed.

## Current status

This document is a proposed implementation plan, not evidence that an Android APK or native hardware integration already exists. The current repository is a Next.js foundation with draft-room functionality. The first Android deliverable should be an isolated branch and preview/build artifact; production and the production Neon branch must remain unchanged until the acceptance gates are met.
