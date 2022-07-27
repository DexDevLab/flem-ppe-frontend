/**
 * Componente da composição do Logotipo.
 *  @module Logo
 */

import { chakra, Flex, useColorModeValue } from "@chakra-ui/react";

/**
 * Monta o Componente de Logo.
 * @method Logo
 * @memberof module:Logo
 * @param {Object} props propriedades do arquivo que compõe o logo.
 */
export const Logo = (props) => (
  <chakra.svg
    xmlns="http://www.w3.org/2000/svg"
    height="100%"
    width="auto"
    color={useColorModeValue("#2b4b84", "blue.200")}
    version="1.1"
    preserveAspectRatio="xMidYMid meet"
    style={{
      shapeRendering: "geometricPrecision",
      textRendering: "geometricPrecision",
      imageRendering: "optimizeQuality",
      fillRule: "evenodd",
      clipRule: "evenodd",
    }}
    viewBox="0 0 42578357 9732686"
    {...props}
  >
    <g id="Camada_x0020_1" fill="currentColor">
      <g id="_105553224712704">
        <path d="M1415451 6879114l3450892 -5749919 3450892 5749919 -6901784 0zm6876306 467616l49200 99714 110011 15982 -79620 77605 18820 109580 -98410 -51747 -98400 51747 18780 -109580 -79580 -77605 110001 -15982 49200 -99714zm-784774 569295l-145695 -76582 -145695 76582 27844 -162219 -117892 -114914 162881 -23663 72863 -147610 72873 147610 162881 23663 -117862 114914 27803 162219zm-206526 677992l-98410 -51707 -98400 51707 18780 -109580 -79580 -77605 110001 -15982 49200 -99714 49200 99714 110041 15982 -79620 77605 18790 109580zm-458522 365145l-119025 -62575 -119025 62575 22740 -132540 -96274 -93838 133032 -19351 59527 -120549 59497 120549 133062 19351 -96315 93838 22780 132540zm-548470 176777l-98400 -51747 -98400 51747 18780 -109580 -79620 -77605 110041 -15982 49200 -99714 49200 99714 110041 15982 -79661 77605 18820 109580zm-935393 -904090l-161748 -85025 -161758 85025 30882 -180106 -130836 -127547 180818 -26279 80894 -163883 80854 163883 180858 26279 -130876 127547 30912 180106zm-341082 1066519l-161758 -85035 -161748 85035 30872 -180116 -130836 -127577 180818 -26249 80894 -163873 80864 163873 180848 26249 -130866 127577 30912 180116zm-105519 -1564335l-187496 -98581 -187506 98581 35835 -208762 -151711 -147881 209644 -30420 93738 -189982 93768 189982 209574 30420 -151671 147881 35825 208762zm-490878 591905l141554 -20544 63277 -128299 63317 128299 141524 20544 -102401 99854 24194 140923 -126635 -66536 -126595 66536 24194 -140923 -102431 -99854zm-141594 -54474l-161748 -85065 -161758 85065 30882 -180146 -130836 -127547 180848 -26279 80864 -163833 80854 163833 180858 26279 -130876 127547 30912 180146zm-1257945 504544l-118283 -62184 -118243 62184 22570 -131688 -95643 -93236 132179 -19251 59136 -119797 59146 119797 132219 19251 -95683 93236 22600 131688zm-469621 -964750l25608 -149445 -108557 -105870 150047 -21788 67097 -135969 67107 135969 150037 21788 -108587 105870 25678 149445 -134235 -70607 -134195 70607zm-361706 474574l-98440 -51747 -98400 51747 18820 -109620 -79620 -77565 110001 -16022 49200 -99683 49240 99683 110001 16022 -79620 77565 18820 109620zm-598442 -636222l-118253 -62184 -118243 62184 22570 -131688 -95683 -93277 132250 -19211 59106 -119797 59146 119797 132209 19211 -95673 93277 22570 131688zm5902793 -4850612l157857 -319926 157897 319926 353073 51326 -255485 249018 60309 351619 -315795 -166029 -315755 166029 60299 -351619 -255445 -249018 353043 -51326zm-2627736 -2798999c-2687614,0 -4866343,2178729 -4866343,4866343 0,2687614 2178729,4866343 4866343,4866343 2687614,0 4866343,-2178729 4866343,-4866343 0,-2687614 -2178729,-4866343 -4866343,-4866343z" />
        <polygon points="11019287,684048 17829850,684048 17829850,2751563 13378654,2751563 13378654,4198819 17404335,4198819 17404335,6156935 13378654,6156935 13378654,9197381 11019287,9197381 " />
        <polygon points="18656645,684048 21016022,684048 21016022,7129856 25138930,7129856 25138930,9197381 18656645,9197381 " />
        <polygon points="25904754,684048 32751783,684048 32751783,2690803 28239826,2690803 28239826,3979970 32326268,3979970 32326268,5840719 28239826,5840719 28239826,7190697 32812764,7190697 32812764,9197381 25904754,9197381 " />
        <polygon points="33529960,684048 36023210,684048 38054129,3979970 40085147,684048 42578357,684048 42578357,9197381 40231193,9197381 40231193,4308288 38054129,7640657 38005490,7640657 35840728,4332592 35840728,9197381 33529960,9197381 " />
      </g>
    </g>
  </chakra.svg>
);
