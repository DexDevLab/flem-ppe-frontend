import {
  PhoneNumberFormat,
  PhoneNumberType,
  PhoneNumberUtil,
} from "google-libphonenumber";
import { exceptionHandler } from "./exceptionHandler";

const phoneUtil = new PhoneNumberUtil();

/**
 * Utilitário que funciona como um handler para exceções tratadas
 * e não-tratadas na aplicação. Realiza um console.log como padrão,
 * tanto ao receber a Exceção quanto ao tratá-la e, no caso do Frontend,
 * pode devolver intuitivamente ao usuário como um Toast (notificação).
 * @method phoneNumberFixer
 * @memberof module:utils
 * @param {String} number o número de telefone
 * @param {String} countryCode o código do país
 * @returns {Object} Objeto contendo as informações sobre o número de
 * telefone, como a seguir:
 *
 * formatted - o número com a formatação correta
 *
 * isValid - se o número é válido como número de telefone
 *
 * success - se a validação foi feita com sucesso ou houveram erros
 *
 * code - o código do país
 *
 */
export const phoneNumberFixer = (number, countryCode) => {
  if (number === null) {
    return {
      formatted: null,
      isValid: null,
      success: false,
      code: countryCode,
    };
  }
  try {
    const phoneNumber = phoneUtil.parse(
      number.split("+").join(""),
      countryCode
    );
    const fixedOrMobileFormatter = (number) => {
      const rawNumber = phoneUtil.format(phoneNumber, PhoneNumberFormat.E164);
      switch (phoneUtil.getNumberType(number) && rawNumber.length) {
        case PhoneNumberType.FIXED_LINE:
        case PhoneNumberType.MOBILE && 14:
          return rawNumber.slice(3);
        case PhoneNumberType.MOBILE && 13:
          return rawNumber.slice(3, 5) + 9 + rawNumber.slice(5, 14);
        default:
          return rawNumber.slice(3);
      }
      // if (phoneUtil.getNumberType(number) === PhoneNumberType.FIXED_LINE) {
      //   return rawNumber;
      // }
      // if (
      //   phoneUtil.getNumberType(number) === PhoneNumberType.MOBILE &&
      //   rawNumber.length === 16
      // ) {
      //   return rawNumber.slice(0, 7) + 9 + rawNumber.slice(7, 16);
      // }
      // if (
      //   phoneUtil.getNumberType(number) === PhoneNumberType.MOBILE &&
      //   rawNumber.length === 17
      // ) {
      //   return rawNumber;
      // }
    };
    const output = {
      formatted: fixedOrMobileFormatter(phoneNumber),
      isValid: phoneUtil.isValidNumber(phoneNumber),
      success: true,
      code: countryCode,
    };
    return output;
  } catch (e) {
    exceptionHandler(e, 0);
    return { formatted: "", isValid: "", success: false, code: "" };
  }
};
