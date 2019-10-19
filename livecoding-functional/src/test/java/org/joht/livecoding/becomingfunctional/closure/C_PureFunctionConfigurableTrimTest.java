package org.joht.livecoding.becomingfunctional.closure;

import static org.junit.Assert.assertEquals;

import java.util.Collection;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class C_PureFunctionConfigurableTrimTest {

	private final RightTrimTestCase testCase;

	@Parameters(name = "{0} ({index})")
    public static Collection<Object[]> data() {
        return RightTrimTestCase.all();
    }
	
	public C_PureFunctionConfigurableTrimTest(RightTrimTestCase testCase) {
		this.testCase = testCase;
	}

	@Test
	public void testCaseShouldBeFulfilled() {
		C_PureFunctionConfigurableTrim functionUnderTest = new C_PureFunctionConfigurableTrim();	
		String result = functionUnderTest.apply(testCase.getInput(), testCase.getPattern());
		assertEquals(testCase.getExpectedResult(), result);
	}
}
