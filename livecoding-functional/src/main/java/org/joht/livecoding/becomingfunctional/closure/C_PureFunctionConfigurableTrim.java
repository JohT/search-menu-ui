package org.joht.livecoding.becomingfunctional.closure;

import java.util.function.BiFunction;
import java.util.regex.Pattern;

// Note: pure function
//
// Note: use/reuse: 
// Can be reused for right, left and all other trims.
// but is hard to use, because the trickiest part
// is defining the right pattern.
//
// Note: adding parameters doen't scale: 
// Even this simple function now uses two input parameters.
// To keep things maintainable, more than two or at most
// three parameters are not advisable.
public class C_PureFunctionConfigurableTrim implements BiFunction<String, Pattern, String> {
	
	@Override
	public String apply(String value, Pattern pattern) {
		if (value == null) {
			return null;
		}
		return pattern.matcher(value).replaceAll("");
	}
	
	//How to use it:
	public static final String rightTrim(String value) {
		C_PureFunctionConfigurableTrim function = new C_PureFunctionConfigurableTrim();
		Pattern rightTrim = Pattern.compile("\\s+$");
		return function.apply(value, rightTrim);
	}
}
