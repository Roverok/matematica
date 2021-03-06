var Matematica = require('./../lib/matematica.js'),
    simplify = Matematica.compiler.passes.simplifier,
    parser =  Matematica.parser,
    parse = parser.parse,
    constant = Matematica.ast.constant, 
    identifier = Matematica.ast.identifier,
    functionInvocation = Matematica.ast.functionInvocation,
    assignment = Matematica.ast.assignment,
    additive = Matematica.ast.additive,
    multiplicative = Matematica.ast.multiplicative,
    negative = Matematica.ast.negative,
    program = Matematica.ast.program;

require('should');

suite('Simplify Expressions', function() {
    test('5  = 5 (Do nothing)', function() {
        simplify(constant(5)).should.eql(constant(5));
    });

    test('-(5) = -5 (NegativeExpression/ConstantExpression)', function() {
        simplify(negative(constant(5))).should.eql( constant(-5) );
    });

    test('2 + 4 = 6 (AdditiveExpression/ConstantExpressions)', function() {
        simplify(additive(constant(2), constant(4))).should.eql( constant(6) );
    });

    test('2 - 4 = -2 (AdditiveExpression/ConstantExpressions)', function() {
        simplify(additive(constant(2), constant(4), '-')).should.eql( constant(-2) );
    });

    test('2 * (4 + 7) = 22 (MultiplicativeExpression/Multiplicative/ConstantExpressions)', function() {
        simplify(multiplicative( constant(2), additive( constant(4), constant(7) )))
        .should.eql( constant(22) );
    });

    test('x = x (FunctionInvocation)', function() {
        simplify(functionInvocation('x')).should.eql( functionInvocation('x') );
    });

    test('-(x) = -x (NegativeExpression/FunctionInvocation)', function() {
        simplify(negative(functionInvocation('x'))).should.eql( negative(functionInvocation('x')) );
    });

    test('-(x(5)) = -x(5) (NegativeExpression/FunctionInvocation)', function() {
        simplify(negative(functionInvocation('x', [constant(5)])))
        .should.eql(negative(functionInvocation('x', [constant(5)])));
    });

    test('(x + 2) + 3 = x + 5 (NegativeExpression/FunctionInvocation)', function() {
        simplify(additive(additive(functionInvocation('x'), constant(2)), constant(3)))
        .should.eql(additive(functionInvocation('x'), constant(5)));
    });

    test('x + (2 - 3) = x -1 (NegativeExpression/FunctionInvocation)', function() {
        simplify(additive(functionInvocation('x'), additive(constant(2), negative(constant(3)))))
        .should.eql(additive(functionInvocation('x'), constant(-1)));
    });

});
