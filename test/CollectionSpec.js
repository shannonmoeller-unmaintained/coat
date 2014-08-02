'use strict';

var Collection = require('../src/collection'),
	supply = require('mtil/function/supply'),
	collection = Collection,
	expect = require('expect.js');

describe('Collection', function () {
	it('should wrap an array', function () {
		var arr = [],
			a = collection(arr),
			b = new Collection(arr),
			c = collection(b),
			d = collection();

		expect(a instanceof Collection).to.be(true);
		expect(b instanceof Collection).to.be(true);

		expect(a.arr).to.be(arr); // functional
		expect(b.arr).to.be(arr); // classical
		expect(c.arr).to.be(arr); // re-wrap
		expect(d.arr).to.eql([]); // create

		expect(a).not.to.be(b);
		expect(b).not.to.be(c);
	});

	describe('prototype', function () {
		describe('add', function () {
			it('should add an item', function (done) {
				var count = 0,
					foo = { foo: 1 },
					bar = { bar: 2 },
					baz = { baz: 3 },
					arr = [foo],
					a = collection(arr);

				a.on('change', supply(
					function (changeset) {
						expect(changeset).to.eql([
							{
								object: arr,
								type: 'add',
								name: '1'
							},
							{
								object: arr,
								type: 'update',
								name: 'length',
								oldValue: 1
							}
						]);

						count++;
					},
					function (changeset) {
						expect(changeset).to.eql([
							{
								object: arr,
								type: 'add',
								name: '2'
							},
							{
								object: arr,
								type: 'update',
								name: 'length',
								oldValue: 2
							}
						]);

						count++;
					}
				));

				a.add(bar);
				a.add(baz);

				expect(a.slice()).to.eql([foo, bar, baz]);

				process.nextTick(function () {
					expect(count).to.be(2);
					done();
				});
			});
		});

		describe('empty', function () {
			it('should remove all items', function (done) {
				var count = 0,
					foo = { foo: 1 },
					bar = { bar: 2 },
					baz = { baz: 3 },
					arr = [foo, bar, baz],
					a = collection(arr);

				a.on('change', function (changeset) {
					expect(changeset).to.eql([
						{
							object: arr,
							type: 'delete',
							name: '0',
							oldValue: foo
						},
						{
							object: arr,
							type: 'delete',
							name: '1',
							oldValue: bar
						},
						{
							object: arr,
							type: 'delete',
							name: '2',
							oldValue: baz
						},
						{
							object: arr,
							type: 'update',
							name: 'length',
							oldValue: 3
						}
					]);

					count++;
				});

				a.empty();

				expect(a.slice()).to.eql([]);

				process.nextTick(function () {
					expect(count).to.be(1);
					done();
				});
			});
		});

		describe('remove', function () {
			it('should remove an item', function (done) {
				var count = 0,
					foo = { foo: 1 },
					bar = { bar: 2 },
					baz = { baz: 3 },
					arr = [foo, bar, baz],
					a = collection(arr);

				a.on('change', function (changeset) {
					expect(changeset).to.eql([
						{
							object: arr,
							type: 'delete',
							name: '1',
							oldValue: bar
						},
						{
							object: arr,
							type: 'update',
							name: 'length',
							oldValue: 3
						}
					]);

					count++;
				});

				a.remove(bar);
				a.remove(null);

				expect(a.slice()).to.eql([foo, baz]);

				process.nextTick(function () {
					expect(count).to.be(1);
					done();
				});
			});
		});

		describe('slice', function () {
			it('should return a subset of items', function () {
				var foo = { foo: 1 },
					bar = { bar: 2 },
					baz = { baz: 3 },
					arr = [foo, bar, baz],
					a = collection(arr);

				expect(a.slice(0, 1)).to.eql([foo]);
				expect(a.slice(1, 3)).to.eql([bar, baz]);
				expect(a.slice(1)).to.eql([bar, baz]);
				expect(a.slice(2)).to.eql([baz]);
				expect(a.slice(-2)).to.eql([bar, baz]);
				expect(a.slice(-2, -1)).to.eql([bar]);
				expect(a.slice()).to.eql([foo, bar, baz]);
			});
		});

		describe('splice', function () {
			it('should manipulate an array', function (done) {
				var count = 0,
					foo = { foo: 1 },
					bar = { bar: 2 },
					baz = { baz: 3 },
					bat = { bat: 4 },
					arr = [foo, bar, baz],
					a = collection(arr);

				a.on('change', function (changeset) {
					expect(changeset).to.eql([
						{
							object: arr,
							type: 'delete',
							name: '1',
							oldValue: bar
						},
						{
							object: arr,
							type: 'add',
							name: '1'
						}
					]);

					count++;
				});

				a.splice(1, 1, bat);
				a.splice(0, 0);
				a.splice(null);

				process.nextTick(function () {
					expect(count).to.be(1);
					done();
				});
			});
		});
	});
});
