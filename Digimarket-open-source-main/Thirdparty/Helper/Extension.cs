using Core.Helper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Thirdparty.Helper
{
	public static class Extension
	{
		/// <summary>
		/// Get the discription of selected Enum
		/// </summary>
		/// <typeparam name="T"> Enum Type</typeparam>
		/// <param name="enumValue"> selected enum</param>
		/// <returns>description</returns>
		public static string GetDescription<T>(this T enumValue)
					   where T : struct, IConvertible
		{
			if (!typeof(T).IsEnum)
				return null;

			var description = enumValue.ToString();
			var fieldInfo = enumValue.GetType().GetField(enumValue.ToString());

			if (fieldInfo != null)
			{
				var attrs = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), true);
				if (attrs != null && attrs.Length > 0)
				{
					description = ((DescriptionAttribute)attrs[0]).Description;
				}
			}

			return description;
		}
		/// <summary>
		/// Replace keys in the string with values based on given List of key value pair
		/// </summary>
		/// <param name="str">string</param>
		/// <param name="replacementDict">list of key value pair</param>
		/// <returns>updated string</returns>
		public static string ReplaceKeyWithValue(this string str, List<KeyValuePair<string, string>> replacementDict)
		{
			foreach (var keyValuePair in replacementDict)
			{
				str = str.Replace(keyValuePair.Key, keyValuePair.Value);
			}
			return str;
		}
		public static DateTime ConvertToDateTime(this string str)
		{
			if (string.IsNullOrEmpty(str))
			{
				return DateTime.MinValue;
			}
			var dateTime = DateTime.ParseExact(str, "MM/d/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
			return dateTime.RemoveSeconds();
		}
		public static DateTime RemoveSeconds(this DateTime obj)
		{
			return obj.AddSeconds(-obj.Second);
		}

		public static string ConvertToString(this DateTime obj)
		{
			return obj.ToString("MM/d/yyyy h:mm:ss tt");
		}


		public static bool? ConvertToBool(this ulong? val)
		{
			if (val.HasValue)
			{
				return val.Value == 1;
			}
			return null;
		}
		public static ulong? ConvertToUlong(this bool? val)
		{
			if (val.HasValue)
			{
				return (ulong)(val.Value == true ? 1 : 0);
			}
			return null;
		}

		public static List<T> DistinctBy<T, TKey>(this List<T> enumerable, Func<T, TKey> keySelector)
		{
			var abc =enumerable.GroupBy(keySelector).Select(grp => grp.First()).ToList();
			return abc;
		}

		public static string GetRoleDisplayName(this RoleType role)
		{
            string displayName;
            switch (role)
            {
                case RoleType.UsernameLoginStudent:
                    {
						displayName = "Username Login Student";
						break;
                    }
                default:
                    {
                        displayName = role.ToString();
                        break;
                    }
            }
			return displayName;
        }

	}
}
