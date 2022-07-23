import { Router } from 'express';
import { ActivateAccountController } from './controllers/auth/ActivateAccountController';
import { AuthenticateUserLocalController } from './controllers/auth/AuthenticateUserLocalController';
import { RegisterUserLocalController } from './controllers/auth/RegisterUserLocalController';
import { PostController } from './controllers/post/PostController';
import { TransactionsController } from './controllers/transactions/TransactionsController';
import { UserController } from './controllers/user/UserController';
import { UserTransactionsController } from './controllers/user/UserTransactionsController';
import { UserWalletController } from './controllers/user/UserWalletController';
import { ensureAuthenticatedAndConfirmed } from './middlewares/guards/EnsureAuthenticatedAndConfirmed';
import { ensureRoutePermission} from './middlewares/guards/EnsureRoutePermission';

const routes = Router();
const defaultPermission = ensureRoutePermission(['CREATOR','USER','ADMIN']);

routes.post('/register/local', new RegisterUserLocalController().handle);
routes.post('/auth/local', new AuthenticateUserLocalController().handle);
routes.get('/auth/activate', new ActivateAccountController().handle);

routes.get('/users/me',ensureAuthenticatedAndConfirmed, defaultPermission, new UserController().me);
routes.get('/users/me/followers',ensureAuthenticatedAndConfirmed, defaultPermission, new UserController().followers);
routes.get('/users/me/following',ensureAuthenticatedAndConfirmed, defaultPermission, new UserController().following);

routes.post('/users/follow',ensureAuthenticatedAndConfirmed, defaultPermission, new UserController().follow);
routes.post('/users/unfollow',ensureAuthenticatedAndConfirmed, defaultPermission, new UserController().unfollow);

routes.get('/users/wallet', ensureAuthenticatedAndConfirmed, defaultPermission, new UserWalletController().myWallet);
routes.get('/users/wallet/transactions', ensureAuthenticatedAndConfirmed, defaultPermission, new UserTransactionsController().myTransactions);

routes.post('/transactions', ensureAuthenticatedAndConfirmed, ensureRoutePermission(['ADMIN']), new TransactionsController().create);
routes.delete('/transactions/:id', ensureAuthenticatedAndConfirmed, ensureRoutePermission(['ADMIN']), new TransactionsController().delete);
routes.put('/transactions/:id', ensureAuthenticatedAndConfirmed, ensureRoutePermission(['ADMIN']), new TransactionsController().update);

routes.get('/posts', ensureAuthenticatedAndConfirmed, defaultPermission, new PostController().findAll);
routes.post('/posts', ensureAuthenticatedAndConfirmed, defaultPermission, new PostController().create);
routes.get('/posts/:id', ensureAuthenticatedAndConfirmed, defaultPermission, new PostController().findOne);

export { routes };