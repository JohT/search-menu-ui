package org.joht.livecoding.becomingfunctional.closure;

import java.util.function.UnaryOperator;
import java.util.regex.Pattern;

//Note: still pure, but with private static dependency
public class B_PureFunctionRightTrimOptimized implements UnaryOperator<String> {
	
	private static final Pattern RIGHT_TRIM = Pattern.compile("\\s+$");
	
	@Override
	public String apply(String value) {
		if (value == null) {
			return null;
		}
		return RIGHT_TRIM.matcher(value).replaceAll("");
	}
	
	//How to use it:
	public static final String rightTrim(String value) {
		B_PureFunctionRightTrimOptimized function = new B_PureFunctionRightTrimOptimized();
		return function.apply(value);
	}
}
