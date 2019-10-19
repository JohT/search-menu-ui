package org.joht.livecoding.becomingfunctional.closure;

import static org.junit.Assert.assertEquals;

import java.util.Collection;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class D_PureFunctionConfigurableUsingCurryingTest {

	private final RightTrimTestCase testCase;

	@Parameters(name = "{0} ({index})")
    public static Collection<Object[]> data() {
        return RightTrimTestCase.all();
    }
	
	public D_PureFunctionConfigurableUsingCurryingTest(RightTrimTestCase testCase) {
		this.testCase = testCase;
	}

	@Test
	public void testCaseShouldBeFulfilled() {
		D_PureFunctionConfigurableUsingCurrying functionUnderTest = new D_PureFunctionConfigurableUsingCurrying();	
		String result = functionUnderTest.apply(testCase.getPattern()).apply(testCase.getInput());
		assertEquals(testCase.getExpectedResult(), result);
	}
}
