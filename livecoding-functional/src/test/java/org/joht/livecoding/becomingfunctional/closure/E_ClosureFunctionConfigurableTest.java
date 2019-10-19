package org.joht.livecoding.becomingfunctional.closure;

import static org.junit.Assert.*;

import java.util.Collection;
import java.util.function.UnaryOperator;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class E_ClosureFunctionConfigurableTest {

	private final RightTrimTestCase testCase;

	@Parameters(name = "{0} ({index})")
    public static Collection<Object[]> data() {
        return RightTrimTestCase.all();
    }
	
	public E_ClosureFunctionConfigurableTest(RightTrimTestCase testCase) {
		this.testCase = testCase;
	}

	@Test
	public void testCaseShouldBeFulfilled() {
		UnaryOperator<String> functionUnderTest = E_ClosureFunctionConfigurable.ofPattern(testCase.getPattern());	
		String result = functionUnderTest.apply(testCase.getInput());
		assertEquals(testCase.getExpectedResult(), result);
	}
}