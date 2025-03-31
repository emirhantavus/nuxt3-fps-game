import admin from 'firebase-admin';
import serviceAccount from '../admin.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const uid = 'I190eaCzXGY1VuBuf893owdNiY43';

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log('✅ Admin yetkisi başarıyla verildi.');
  })
  .catch((err) => {
    console.error('❌ Yetki verme hatası:', err);
  });
