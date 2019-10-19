package org.joht.livecoding.becomingfunctional.closure;

import java.util.function.UnaryOperator;
import java.util.regex.Pattern;

// Note: no pure function any more
// It is created with (closed over) context (=pattern in this case).
// The result of the function depends on its arguments AND on the
// context it was created in.
// Since java assures, that the context is final and immutable,
// it is "nearly as good as a pure function" with enhanced flexibility.
public class E_ClosureFunctionConfigurable implements UnaryOperator<String> {
	
	private final Pattern pattern;
	
	public static final UnaryOperator<String> ofPattern(Pattern pattern) {
		return new E_ClosureFunctionConfigurable(pattern);
	}
	
	protected E_ClosureFunctionConfigurable(Pattern pattern) {
		this.pattern = pattern;
	}

	@Override
	public String apply(String value) {
		if (value == null) {
			return null;
		}
		return pattern.matcher(value).replaceAll("");
	}

	@Override
	public String toString() {
		return "F_ClosureFunctionConfigurable [pattern=" + pattern + "]";
	}
	
	//How to use it:
	public static final String rightTrim(String value) {
		Pattern rightTrim = Pattern.compile("\\s+$");
		UnaryOperator<String> function = E_ClosureFunctionConfigurable.ofPattern(rightTrim);
		return function.apply(value);
	}

	//Closure as it is seen more often: 
	public static final String rightTrimClosure(String value) {
		final Pattern pattern = Pattern.compile("\\s+$"); //Pattern can't be changed
		UnaryOperator<String> function = string -> pattern.matcher(string).replaceAll("");
		return function.apply(value);
	}
}