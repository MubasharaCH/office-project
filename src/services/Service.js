// export const base_url = 'https://pos-dev.myignite.online/connector/api';
// export const login_base_url = 'https://pos-dev.myignite.online/oauth/token';
// export const baseUrl_WO_Connector = 'https://pos-dev.myignite.online/api';
// export const site_url = 'https://pos-dev.myignite.online/';
// export const pos_url = 'http://fsf-dev.myignite.online';
// export const WalletLink = 'https://wallet31.myignite.online/app/api/';

export const base_url = 'https://dev.api.myignite.online/connector/api';
export const login_base_url = 'https://dev.api.myignite.online/oauth/token';
export const baseUrl_WO_Connector = 'https://dev.api.myignite.online/api';
export const site_url = 'https://dev.api.myignite.online/';
export const pos_url = 'http://fsf-dev.myignite.online';
export const WalletLink = 'https://dev.pay.myignite.online/api/';





// export const base_url = 'https://api.ignite.tech/connector/api';
// export const login_base_url = 'https://api.ignite.tech/oauth/token';
// export const baseUrl_WO_Connector = 'https://api.ignite.tech/api';
// export const site_url = 'https://api.ignite.tech/';
// export const pos_url = 'https://pos.ignitehq.io';
// export const WalletLink = 'https://pay.myignite.online/app/api/';

//Getting Service
export function SuperAdmin(endPoint) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(site_url + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function WalletApi(id, currency) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(WalletLink + currency, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'merchant-uuid': id,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function WalletApiPost(id, currency, form) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(WalletLink + currency, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'merchant-uuid': id,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function DashboardGetFun(endPoint) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function GetSocialData(endPoint,body) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + endPoint, {
      method: 'POST',
      body:JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function GetPosFun(endPoint) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdateFunction(endPoint, values, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + id, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdateCustomFunction(endPoint, values, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + id, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getUserToken(endPoint) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + endPoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function GetFunction(endPoint) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function GetFunctionWithNewUrl(endPoint) {
  // const baseUrl = "https://dev.api.myignite.online/connector/api";
  const newUrl = base_url.replace("/connector", "");
  const updatedUrl = newUrl.replace("//dev.api", "//booking-dev");
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(updatedUrl + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function GetFunctionOto(endPoint) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
///
export function GetMarketPlace(endPoint) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + endPoint, {
      method: 'GET',
      headers: {
        // Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
//get devices list
export function GetDevices(endPoint, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function GetFunctionBDetail(endPoint, token) {
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function GetBusinessDetail(endPoint) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Adding Service
export function AddingDeviceFunction(endPoint) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      // body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
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
}

export function AddShipping(endPoint, values) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddImportProduct(endPoint, values) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function AddingLocationFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
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
}
export function GetVariation(endPoint, variant) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + variant, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log("responseresponseresponse",response.json());
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
//add addresees
export function AddingBillingFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        // Accept: 'application/json',
        // "Content-type":'application/json'
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingAddressFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingUserFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function SelectBusiness(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingCouponsFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdateAlertFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingStockTranfFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingStockFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
//Adding Service
export function UpdateUserFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingCustomerFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingSellFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingSellReturnFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
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
}
export function UpdatingSellFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdatingShipFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingTaxFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdateProfile(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddingVariationFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function AddSubscriptionFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Getting pecific Service
export function GetSpecificFunction(endPoint, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + '/' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function UpdatingUnitFunction(endPoint, values, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + id, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdatingLocationFunction(endPoint, values, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + id, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Application: 'application/json',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdatingLayoutFunction(endPoint, values, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + '/' + id, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        // 'Content-Type': 'multipart/form-data',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function DeleteFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function DeleteFunctionWithUrl(endPoint) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function UpdatingFunction(endPoint, values, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + id, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        // 'Content-Type': 'multipart/form-data',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdatingCouponFunction(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdatingCustomerFunction(endPoint, values, id) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + id, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdatingProduct(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function UpdatingBusinessSetting(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function UpdatingStoreSetting(endPoint, values) {
  let token = localStorage.getItem('user_token');


  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: values,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // console.log('response'+response);
        resolve(response.json());
      })
      .catch((error) => {
        console.log('error',error)
        reject(error);
      });
  });
}

export function UpdatingBusiness(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.status == 401) {
          window.location = '/';
        } else {
          resolve(response.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdatePassword(endPoint, values) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdateIsActive(endPoint, id, value) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + '/' + id, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        //console.log('>>>>>>>>>>> isactive response', response);
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function UpdateShippingStatus(endPoint, id, value) {
  let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint + '/' + id, {
      method: 'PUT',
      body: JSON.stringify(value),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        //console.log('>>>>>>>>>>> isactive response', response);
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// send email to reset password
export function SendEmail(endPoint, value) {
  // let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + endPoint, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        // Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        //console.log('>>>>>>>>>>> response', response);
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//set forgot password
export function setForgotPassword(endPoint, value) {
  // let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + endPoint, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        //  Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        //console.log('>>>>>>>>>>> response', response);
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//share order

export function ShareOrder(value) {
  // let token = localStorage.getItem('user_token');

  return new Promise((resolve, reject) => {
    fetch('https://ign.onl/api/url/add', {
      method: 'POST',
      body:value,
      headers: {
        Authorization: 'tanRpCJO1tqa',
      },
    })
      .then((response) => {
        //console.log('>>>>>>>>>>> response', response);
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function SendOTP(url, value) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl_WO_Connector + url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        //  Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        // Accept: 'application/json',
      },
    })
      .then((response) => {
        //console.log('>>>>>>>>>>> response', response);
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}



// add Tags 
export function AddTags(endPoint, values) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// add Tags 
export function UpdateTag(endPoint, values) {
  let token = localStorage.getItem('user_token');
  return new Promise((resolve, reject) => {
    fetch(base_url + endPoint, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
}


