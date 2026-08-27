const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
function setupSecurity(app){
  app.disable('x-powered-by'); app.use(helmet());
  app.use(rateLimit({windowMs: 60_000, max: 300, standardHeaders:true, legacyHeaders:false}));
}
module.exports={setupSecurity};
