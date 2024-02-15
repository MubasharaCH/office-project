import { baseUrl_WO_Connector, login_base_url } from '../../services/Service';
import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
  ChangePasswordInput,
  ForgetPasswordInput,
  VerifyForgetPasswordTokenInput,
  ResetPasswordInput,
  MakeAdminInput,
  BlockUserInput,
  WalletPointsInput,
  UpdateUser,
  QueryOptionsType,
  UserPaginator,
  UserQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';
import Cookies from 'js-cookie';
import { toUpper } from 'lodash';
// const login_base_url = 'https://pos-dev.myignite.online//oauth/token';
// const login_base_url = 'https://pos-dev.myignite.online//oauth/token';

const register_base_url = baseUrl_WO_Connector + '/business/register';

export const userClient = {
  me: () => {
    return HttpClient.get<User>(API_ENDPOINTS.ME);
  },
  login: (variables: LoginInput) => {
    return new Promise((resolve, reject) => {
      fetch(login_base_url, {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'password',
          client_id: '22',
          client_secret: 'g5SazAxb0YK465BjScWjq5tAr2P1a822ynFx6PId',
          username: variables.email,
          password: variables.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          resolve(response.json());
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  logout: () => {
    return HttpClient.post<any>(API_ENDPOINTS.LOGOUT, {});
  },
  register: (variables: RegisterInput) => {
    let local = Cookies.get('NEXT_LOCALE');
    return new Promise((resolve, reject) => {
      fetch(register_base_url, {
        method: 'POST',
        body: JSON.stringify({
          first_name: localStorage.getItem('userFName'),
          last_name: localStorage.getItem('userLName'),
          surname: localStorage.getItem('userLName'),
          email: localStorage.getItem('userEmail'),
          name: variables.name,
          business_category: variables.business_category_name,
          currency_id: variables.currency_id,
          time_zone: variables.time_zone,
          // password: localStorage.getItem('userPassword'),
          business_code: variables.storeUrl,
          username: variables.storeUrl + '-manager',
          country: variables.country,
          language: toUpper(local),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          resolve(response.json());
        })
        .catch((error) => {
          reject(error);
        });
    });
    // return HttpClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, variables);
  },
  update: ({ id, input }: { id: string; input: UpdateUser }) => {
    return HttpClient.put<User>(`${API_ENDPOINTS.USERS}/${id}`, input);
  },
  changePassword: (variables: ChangePasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.CHANGE_PASSWORD, variables);
  },
  forgetPassword: (variables: ForgetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.FORGET_PASSWORD, variables);
  },
  verifyForgetPasswordToken: (variables: VerifyForgetPasswordTokenInput) => {
    return HttpClient.post<any>(
      API_ENDPOINTS.VERIFY_FORGET_PASSWORD_TOKEN,
      variables
    );
  },
  resetPassword: (variables: ResetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.RESET_PASSWORD, variables);
  },
  makeAdmin: (variables: MakeAdminInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.MAKE_ADMIN, variables);
  },
  block: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.BLOCK_USER, variables);
  },
  unblock: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.UNBLOCK_USER, variables);
  },
  addWalletPoints: (variables: WalletPointsInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.ADD_WALLET_POINTS, variables);
  },
  fetchUsers: ({ name, ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.USERS, {
      searchJoin: 'and',
      with: 'wallet',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  fetchUser: ({ id }: { id: string }) => {
    return HttpClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  },
};
