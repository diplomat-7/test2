export default () => ({
  config: {
    emailSender: process.env.emailSender,
    port: process.env.PORT || 3000,
    database: {
      host: process.env.DB_HOST,
      name: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    jwt_secret: process.env.JWT_SECRET,
    unifonic: {
      appsId: process.env.UNIFONIC_APPS_ID,
      senderId: process.env.UNIFONIC_SENDER_ID,
      baseUrl: process.env.UNIFONIC_BASE_URL,
    },
    google: {
      user: process.env.googleUser,
      clientId: process.env.googleClientId,
      clientSecret: process.env.googleClientSecret,
      refreshToken: process.env.refreshToken,
    },
    admin: {
      email: process.env.adminEmail,
    },
    elm: {
      ip: process.env.elmIp,
      key: process.env.elmKey,
    },
    wathq: {
      key: process.env.wathqKey,
      password: process.env.wathPass,
      freeKeys: process.env.wathqFreeKeys,
      baseUrl: process.env.wathqBaseUrl,
    },
    storage: {
      projectId: process.env.gcpProjectId,
      privateKey: process.env.gcpPrivateKey,
      clientEmail: process.env.gcpClientEmail,
      publicBucket: process.env.gcpPublicBucket,
    },
  },
});
