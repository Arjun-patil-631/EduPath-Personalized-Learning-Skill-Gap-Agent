import ast
import time
import tracemalloc
from typing import Dict, List, Any
import numpy as np
from app.utils.exceptions import PythonSyntaxException

def evaluate_code_solution(
    code: str,
    test_cases: List[Any],
    max_gain: int = 25,
    xp_award: int = 350
) -> Dict[str, Any]:
    """
    Executes submitted Python code against challenge test assertions,
    capturing runtime telemetry and computing dynamic skill score updates.
    """
    # 1. AST Syntax Check
    try:
        ast.parse(code)
    except SyntaxError as e:
        raise PythonSyntaxException(f"SyntaxError: {e.msg} at line {e.lineno}")

    # 2. Execution environment
    exec_globals = {
        "__builtins__": __builtins__,
        "np": np,
        "numpy": np,
    }

    tracemalloc.start()
    start_time = time.perf_counter()

    # Execute user code definitions
    try:
        exec(code, exec_globals)
    except Exception as e:
        tracemalloc.stop()
        raise PythonSyntaxException(f"Execution failed: {str(e)}")

    # 3. Run Test Assertions
    tests_passed = 0
    total_tests = len(test_cases)
    test_results = []

    for tc in test_cases:
        assertion_code = getattr(tc, "assertion_code", "")
        tc_key = getattr(tc, "case_key", "tc")
        name = getattr(tc, "name", "Test Case")
        passed = False
        error_msg = None

        tc_start = time.perf_counter()
        try:
            exec(assertion_code, exec_globals)
            passed = True
            tests_passed += 1
        except AssertionError:
            error_msg = "Assertion failed"
        except Exception as e:
            error_msg = str(e)
        tc_latency = f"{round((time.perf_counter() - tc_start) * 1000, 1)}ms"

        test_results.append({
            "id": tc_key,
            "name": name,
            "status": "passed" if passed else "failed",
            "error": error_msg,
            "latency": tc_latency
        })

    end_time = time.perf_counter()
    _, peak_mem = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    execution_time = f"{round((end_time - start_time) * 1000, 1)}ms"
    memory_usage = f"{round(peak_mem / (1024 * 1024), 1)} MB"
    if peak_mem < 1024 * 1024:
        memory_usage = f"{round(peak_mem / 1024, 1)} KB"

    # Score calculation (0 - 100)
    score = round((tests_passed / total_tests) * 100) if total_tests > 0 else 0

    # Skill delta calculation based on performance
    delta_points = round(max_gain * (score / 100.0))
    earned_xp = round(xp_award * (score / 100.0))

    return {
        "score": score,
        "testsPassed": tests_passed,
        "totalTests": total_tests,
        "executionTime": execution_time,
        "memoryUsage": memory_usage,
        "deltaPoints": delta_points,
        "earnedXp": earned_xp,
        "testResults": test_results
    }
