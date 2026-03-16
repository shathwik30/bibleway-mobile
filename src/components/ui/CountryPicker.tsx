import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Country {
  name: string;
  code: string;
  flag: string;
  dial_code: string;
}

// Comprehensive country list with flags
const COUNTRIES: Country[] = [
  { name: "Afghanistan", code: "AF", flag: "\u{1F1E6}\u{1F1EB}", dial_code: "+93" },
  { name: "Albania", code: "AL", flag: "\u{1F1E6}\u{1F1F1}", dial_code: "+355" },
  { name: "Algeria", code: "DZ", flag: "\u{1F1E9}\u{1F1FF}", dial_code: "+213" },
  { name: "Angola", code: "AO", flag: "\u{1F1E6}\u{1F1F4}", dial_code: "+244" },
  { name: "Argentina", code: "AR", flag: "\u{1F1E6}\u{1F1F7}", dial_code: "+54" },
  { name: "Australia", code: "AU", flag: "\u{1F1E6}\u{1F1FA}", dial_code: "+61" },
  { name: "Austria", code: "AT", flag: "\u{1F1E6}\u{1F1F9}", dial_code: "+43" },
  { name: "Bahrain", code: "BH", flag: "\u{1F1E7}\u{1F1ED}", dial_code: "+973" },
  { name: "Bangladesh", code: "BD", flag: "\u{1F1E7}\u{1F1E9}", dial_code: "+880" },
  { name: "Belgium", code: "BE", flag: "\u{1F1E7}\u{1F1EA}", dial_code: "+32" },
  { name: "Benin", code: "BJ", flag: "\u{1F1E7}\u{1F1EF}", dial_code: "+229" },
  { name: "Bolivia", code: "BO", flag: "\u{1F1E7}\u{1F1F4}", dial_code: "+591" },
  { name: "Botswana", code: "BW", flag: "\u{1F1E7}\u{1F1FC}", dial_code: "+267" },
  { name: "Brazil", code: "BR", flag: "\u{1F1E7}\u{1F1F7}", dial_code: "+55" },
  { name: "Burkina Faso", code: "BF", flag: "\u{1F1E7}\u{1F1EB}", dial_code: "+226" },
  { name: "Burundi", code: "BI", flag: "\u{1F1E7}\u{1F1EE}", dial_code: "+257" },
  { name: "Cambodia", code: "KH", flag: "\u{1F1F0}\u{1F1ED}", dial_code: "+855" },
  { name: "Cameroon", code: "CM", flag: "\u{1F1E8}\u{1F1F2}", dial_code: "+237" },
  { name: "Canada", code: "CA", flag: "\u{1F1E8}\u{1F1E6}", dial_code: "+1" },
  { name: "Chad", code: "TD", flag: "\u{1F1F9}\u{1F1E9}", dial_code: "+235" },
  { name: "Chile", code: "CL", flag: "\u{1F1E8}\u{1F1F1}", dial_code: "+56" },
  { name: "China", code: "CN", flag: "\u{1F1E8}\u{1F1F3}", dial_code: "+86" },
  { name: "Colombia", code: "CO", flag: "\u{1F1E8}\u{1F1F4}", dial_code: "+57" },
  { name: "Congo (DRC)", code: "CD", flag: "\u{1F1E8}\u{1F1E9}", dial_code: "+243" },
  { name: "Congo (Republic)", code: "CG", flag: "\u{1F1E8}\u{1F1EC}", dial_code: "+242" },
  { name: "Costa Rica", code: "CR", flag: "\u{1F1E8}\u{1F1F7}", dial_code: "+506" },
  { name: "Croatia", code: "HR", flag: "\u{1F1ED}\u{1F1F7}", dial_code: "+385" },
  { name: "Cuba", code: "CU", flag: "\u{1F1E8}\u{1F1FA}", dial_code: "+53" },
  { name: "Czech Republic", code: "CZ", flag: "\u{1F1E8}\u{1F1FF}", dial_code: "+420" },
  { name: "Denmark", code: "DK", flag: "\u{1F1E9}\u{1F1F0}", dial_code: "+45" },
  { name: "Dominican Republic", code: "DO", flag: "\u{1F1E9}\u{1F1F4}", dial_code: "+1" },
  { name: "Ecuador", code: "EC", flag: "\u{1F1EA}\u{1F1E8}", dial_code: "+593" },
  { name: "Egypt", code: "EG", flag: "\u{1F1EA}\u{1F1EC}", dial_code: "+20" },
  { name: "El Salvador", code: "SV", flag: "\u{1F1F8}\u{1F1FB}", dial_code: "+503" },
  { name: "Eritrea", code: "ER", flag: "\u{1F1EA}\u{1F1F7}", dial_code: "+291" },
  { name: "Ethiopia", code: "ET", flag: "\u{1F1EA}\u{1F1F9}", dial_code: "+251" },
  { name: "Finland", code: "FI", flag: "\u{1F1EB}\u{1F1EE}", dial_code: "+358" },
  { name: "France", code: "FR", flag: "\u{1F1EB}\u{1F1F7}", dial_code: "+33" },
  { name: "Gabon", code: "GA", flag: "\u{1F1EC}\u{1F1E6}", dial_code: "+241" },
  { name: "Gambia", code: "GM", flag: "\u{1F1EC}\u{1F1F2}", dial_code: "+220" },
  { name: "Germany", code: "DE", flag: "\u{1F1E9}\u{1F1EA}", dial_code: "+49" },
  { name: "Ghana", code: "GH", flag: "\u{1F1EC}\u{1F1ED}", dial_code: "+233" },
  { name: "Greece", code: "GR", flag: "\u{1F1EC}\u{1F1F7}", dial_code: "+30" },
  { name: "Guatemala", code: "GT", flag: "\u{1F1EC}\u{1F1F9}", dial_code: "+502" },
  { name: "Guinea", code: "GN", flag: "\u{1F1EC}\u{1F1F3}", dial_code: "+224" },
  { name: "Haiti", code: "HT", flag: "\u{1F1ED}\u{1F1F9}", dial_code: "+509" },
  { name: "Honduras", code: "HN", flag: "\u{1F1ED}\u{1F1F3}", dial_code: "+504" },
  { name: "Hong Kong", code: "HK", flag: "\u{1F1ED}\u{1F1F0}", dial_code: "+852" },
  { name: "Hungary", code: "HU", flag: "\u{1F1ED}\u{1F1FA}", dial_code: "+36" },
  { name: "India", code: "IN", flag: "\u{1F1EE}\u{1F1F3}", dial_code: "+91" },
  { name: "Indonesia", code: "ID", flag: "\u{1F1EE}\u{1F1E9}", dial_code: "+62" },
  { name: "Iran", code: "IR", flag: "\u{1F1EE}\u{1F1F7}", dial_code: "+98" },
  { name: "Iraq", code: "IQ", flag: "\u{1F1EE}\u{1F1F6}", dial_code: "+964" },
  { name: "Ireland", code: "IE", flag: "\u{1F1EE}\u{1F1EA}", dial_code: "+353" },
  { name: "Israel", code: "IL", flag: "\u{1F1EE}\u{1F1F1}", dial_code: "+972" },
  { name: "Italy", code: "IT", flag: "\u{1F1EE}\u{1F1F9}", dial_code: "+39" },
  { name: "Ivory Coast", code: "CI", flag: "\u{1F1E8}\u{1F1EE}", dial_code: "+225" },
  { name: "Jamaica", code: "JM", flag: "\u{1F1EF}\u{1F1F2}", dial_code: "+1" },
  { name: "Japan", code: "JP", flag: "\u{1F1EF}\u{1F1F5}", dial_code: "+81" },
  { name: "Jordan", code: "JO", flag: "\u{1F1EF}\u{1F1F4}", dial_code: "+962" },
  { name: "Kenya", code: "KE", flag: "\u{1F1F0}\u{1F1EA}", dial_code: "+254" },
  { name: "Kuwait", code: "KW", flag: "\u{1F1F0}\u{1F1FC}", dial_code: "+965" },
  { name: "Lebanon", code: "LB", flag: "\u{1F1F1}\u{1F1E7}", dial_code: "+961" },
  { name: "Liberia", code: "LR", flag: "\u{1F1F1}\u{1F1F7}", dial_code: "+231" },
  { name: "Libya", code: "LY", flag: "\u{1F1F1}\u{1F1FE}", dial_code: "+218" },
  { name: "Madagascar", code: "MG", flag: "\u{1F1F2}\u{1F1EC}", dial_code: "+261" },
  { name: "Malawi", code: "MW", flag: "\u{1F1F2}\u{1F1FC}", dial_code: "+265" },
  { name: "Malaysia", code: "MY", flag: "\u{1F1F2}\u{1F1FE}", dial_code: "+60" },
  { name: "Mali", code: "ML", flag: "\u{1F1F2}\u{1F1F1}", dial_code: "+223" },
  { name: "Mexico", code: "MX", flag: "\u{1F1F2}\u{1F1FD}", dial_code: "+52" },
  { name: "Morocco", code: "MA", flag: "\u{1F1F2}\u{1F1E6}", dial_code: "+212" },
  { name: "Mozambique", code: "MZ", flag: "\u{1F1F2}\u{1F1FF}", dial_code: "+258" },
  { name: "Myanmar", code: "MM", flag: "\u{1F1F2}\u{1F1F2}", dial_code: "+95" },
  { name: "Namibia", code: "NA", flag: "\u{1F1F3}\u{1F1E6}", dial_code: "+264" },
  { name: "Nepal", code: "NP", flag: "\u{1F1F3}\u{1F1F5}", dial_code: "+977" },
  { name: "Netherlands", code: "NL", flag: "\u{1F1F3}\u{1F1F1}", dial_code: "+31" },
  { name: "New Zealand", code: "NZ", flag: "\u{1F1F3}\u{1F1FF}", dial_code: "+64" },
  { name: "Nicaragua", code: "NI", flag: "\u{1F1F3}\u{1F1EE}", dial_code: "+505" },
  { name: "Niger", code: "NE", flag: "\u{1F1F3}\u{1F1EA}", dial_code: "+227" },
  { name: "Nigeria", code: "NG", flag: "\u{1F1F3}\u{1F1EC}", dial_code: "+234" },
  { name: "North Korea", code: "KP", flag: "\u{1F1F0}\u{1F1F5}", dial_code: "+850" },
  { name: "Norway", code: "NO", flag: "\u{1F1F3}\u{1F1F4}", dial_code: "+47" },
  { name: "Oman", code: "OM", flag: "\u{1F1F4}\u{1F1F2}", dial_code: "+968" },
  { name: "Pakistan", code: "PK", flag: "\u{1F1F5}\u{1F1F0}", dial_code: "+92" },
  { name: "Palestine", code: "PS", flag: "\u{1F1F5}\u{1F1F8}", dial_code: "+970" },
  { name: "Panama", code: "PA", flag: "\u{1F1F5}\u{1F1E6}", dial_code: "+507" },
  { name: "Papua New Guinea", code: "PG", flag: "\u{1F1F5}\u{1F1EC}", dial_code: "+675" },
  { name: "Paraguay", code: "PY", flag: "\u{1F1F5}\u{1F1FE}", dial_code: "+595" },
  { name: "Peru", code: "PE", flag: "\u{1F1F5}\u{1F1EA}", dial_code: "+51" },
  { name: "Philippines", code: "PH", flag: "\u{1F1F5}\u{1F1ED}", dial_code: "+63" },
  { name: "Poland", code: "PL", flag: "\u{1F1F5}\u{1F1F1}", dial_code: "+48" },
  { name: "Portugal", code: "PT", flag: "\u{1F1F5}\u{1F1F9}", dial_code: "+351" },
  { name: "Qatar", code: "QA", flag: "\u{1F1F6}\u{1F1E6}", dial_code: "+974" },
  { name: "Romania", code: "RO", flag: "\u{1F1F7}\u{1F1F4}", dial_code: "+40" },
  { name: "Russia", code: "RU", flag: "\u{1F1F7}\u{1F1FA}", dial_code: "+7" },
  { name: "Rwanda", code: "RW", flag: "\u{1F1F7}\u{1F1FC}", dial_code: "+250" },
  { name: "Saudi Arabia", code: "SA", flag: "\u{1F1F8}\u{1F1E6}", dial_code: "+966" },
  { name: "Senegal", code: "SN", flag: "\u{1F1F8}\u{1F1F3}", dial_code: "+221" },
  { name: "Sierra Leone", code: "SL", flag: "\u{1F1F8}\u{1F1F1}", dial_code: "+232" },
  { name: "Singapore", code: "SG", flag: "\u{1F1F8}\u{1F1EC}", dial_code: "+65" },
  { name: "Somalia", code: "SO", flag: "\u{1F1F8}\u{1F1F4}", dial_code: "+252" },
  { name: "South Africa", code: "ZA", flag: "\u{1F1FF}\u{1F1E6}", dial_code: "+27" },
  { name: "South Korea", code: "KR", flag: "\u{1F1F0}\u{1F1F7}", dial_code: "+82" },
  { name: "South Sudan", code: "SS", flag: "\u{1F1F8}\u{1F1F8}", dial_code: "+211" },
  { name: "Spain", code: "ES", flag: "\u{1F1EA}\u{1F1F8}", dial_code: "+34" },
  { name: "Sri Lanka", code: "LK", flag: "\u{1F1F1}\u{1F1F0}", dial_code: "+94" },
  { name: "Sudan", code: "SD", flag: "\u{1F1F8}\u{1F1E9}", dial_code: "+249" },
  { name: "Sweden", code: "SE", flag: "\u{1F1F8}\u{1F1EA}", dial_code: "+46" },
  { name: "Switzerland", code: "CH", flag: "\u{1F1E8}\u{1F1ED}", dial_code: "+41" },
  { name: "Syria", code: "SY", flag: "\u{1F1F8}\u{1F1FE}", dial_code: "+963" },
  { name: "Taiwan", code: "TW", flag: "\u{1F1F9}\u{1F1FC}", dial_code: "+886" },
  { name: "Tanzania", code: "TZ", flag: "\u{1F1F9}\u{1F1FF}", dial_code: "+255" },
  { name: "Thailand", code: "TH", flag: "\u{1F1F9}\u{1F1ED}", dial_code: "+66" },
  { name: "Togo", code: "TG", flag: "\u{1F1F9}\u{1F1EC}", dial_code: "+228" },
  { name: "Trinidad and Tobago", code: "TT", flag: "\u{1F1F9}\u{1F1F9}", dial_code: "+1" },
  { name: "Tunisia", code: "TN", flag: "\u{1F1F9}\u{1F1F3}", dial_code: "+216" },
  { name: "Turkey", code: "TR", flag: "\u{1F1F9}\u{1F1F7}", dial_code: "+90" },
  { name: "Uganda", code: "UG", flag: "\u{1F1FA}\u{1F1EC}", dial_code: "+256" },
  { name: "Ukraine", code: "UA", flag: "\u{1F1FA}\u{1F1E6}", dial_code: "+380" },
  { name: "United Arab Emirates", code: "AE", flag: "\u{1F1E6}\u{1F1EA}", dial_code: "+971" },
  { name: "United Kingdom", code: "GB", flag: "\u{1F1EC}\u{1F1E7}", dial_code: "+44" },
  { name: "United States", code: "US", flag: "\u{1F1FA}\u{1F1F8}", dial_code: "+1" },
  { name: "Uruguay", code: "UY", flag: "\u{1F1FA}\u{1F1FE}", dial_code: "+598" },
  { name: "Venezuela", code: "VE", flag: "\u{1F1FB}\u{1F1EA}", dial_code: "+58" },
  { name: "Vietnam", code: "VN", flag: "\u{1F1FB}\u{1F1F3}", dial_code: "+84" },
  { name: "Yemen", code: "YE", flag: "\u{1F1FE}\u{1F1EA}", dial_code: "+967" },
  { name: "Zambia", code: "ZM", flag: "\u{1F1FF}\u{1F1F2}", dial_code: "+260" },
  { name: "Zimbabwe", code: "ZW", flag: "\u{1F1FF}\u{1F1FC}", dial_code: "+263" },
];

interface CountryPickerProps {
  label?: string;
  value: string;
  onChange: (countryName: string) => void;
  error?: string;
}

export default function CountryPicker({ label, value, onChange, error }: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedCountry = COUNTRIES.find((c) => c.name === value);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-textPrimary mb-1.5">{label}</Text>
      )}
      <Pressable
        onPress={() => setVisible(true)}
        className={`flex-row items-center justify-between border rounded-lg px-3 py-3 bg-white ${
          error ? 'border-error' : 'border-border'
        }`}
      >
        <Text className={`text-base ${value ? 'text-textPrimary' : 'text-gray-400'}`}>
          {selectedCountry ? `${selectedCountry.flag}  ${selectedCountry.name}` : 'Select country...'}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#6B7280" />
      </Pressable>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable onPress={() => setVisible(false)} className="flex-1 bg-black/40" />
        <View className="bg-white rounded-t-2xl" style={{ maxHeight: '70%' }}>
          <View className="px-4 py-3 border-b border-border">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-textPrimary">Select Country</Text>
              <Pressable onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1A2E" />
              </Pressable>
            </View>
            <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
              <Ionicons name="search-outline" size={18} color="#6B7280" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search countries..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-2 text-base text-textPrimary"
                autoFocus
              />
            </View>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item.name);
                  setSearch('');
                  setVisible(false);
                }}
                className={`flex-row items-center justify-between px-4 py-3 border-b border-border/50 ${
                  value === item.name ? 'bg-primary/5' : ''
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <Text className="text-xl mr-3">{item.flag}</Text>
                  <Text
                    className={`text-base ${
                      value === item.name ? 'text-primary font-semibold' : 'text-textPrimary'
                    }`}
                  >
                    {item.name}
                  </Text>
                </View>
                {value === item.name && (
                  <Ionicons name="checkmark-circle" size={22} color="#4A6FA5" />
                )}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

export { COUNTRIES };
