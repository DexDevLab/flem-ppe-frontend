import { getNetworkTime } from "ntp-client";
import { DateTime } from "luxon";

export const timeNtpService = () =>
  new Promise((resolve, reject) => {
    getNetworkTime(`a.st1.ntp.br`, 123, (err, date) => {
      if (err) {
        getNetworkTime(`b.st1.ntp.br`, 123, (err, date) => {
          if (err) {
            getNetworkTime(`b.st1.ntp.br`, 123, (err, date) => {
              if (err) {
                reject(err);
              } else {
                resolve(DateTime.fromJSDate(date).setLocale("pt-BR"));
              }
            });
          } else {
            resolve(DateTime.fromJSDate(date).setLocale("pt-BR"));
          }
        });
      } else {
        resolve(DateTime.fromJSDate(date).setLocale("pt-BR"));
      }
    });
  });
