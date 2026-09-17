#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
check(){ if grep -Rqs --exclude='*.map' "$1" "$ROOT/app" "$ROOT/components" "$ROOT/lib" 2>/dev/null; then echo "PASS: $2"; else echo "WARN: $2"; fail=1; fi; }
check 'Referral code' 'referral signup copy present'
check 'recovery' 'recovery flow code present'
check 'transaction hash' 'transaction hash flow present'
check 'withdraw' 'withdrawal flow present'
check 'notification' 'notification flow present'
check 'TEST_MODE' 'test-mode guard present'
exit $fail
