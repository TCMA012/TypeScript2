/*
Learning TypeScript: Enhance Your Web Development Skills Using Type-Safe JavaScript
Josh Goldberg
Microsoft
typescript-eslint and TypeStat
Codecademy
https://github.com/LearningTypeScript/site
https://www.learningtypescript.com/

as const operator
a const assertion that can be placed after a value
const assertion use the most literal, readonly possible form of the value when inferring its type.
If one is placed after an array literal, it will indicate that the array should be treated as a tuple.
Switch from flexible sized arrays to fixed sized tuple: also the tuple is readonly 
*/
const unionArray = [1, "Tom"]; // (string | number)[]
const readonlyTuple = [1, "Tom"] as const; // readonly [1, "Tom"]



/*
interface
can merge together to be augmented - working with third party code such as built in globals or npm packages
can type check the structure of class declarations
speedier: declare a named type that can be cached more easily
named objects rather than an alias for an unnamed object literal, so error messages are more readable

Use interface (unless need union types from type aliases)




Declaring interface members as functions:
Method syntax
member(): void

Property syntax
member: () => void
*/
interface HasBothFunctionTypes {
    property: () => string;
    method(): string;
}

const hasBoth: HasBothFunctionTypes = {
    property: () => "",
    method() {
        return "";
    }
}

hasBoth.property(); // Ok
hasBoth.method(); // Ok



interface OptionalReadonlyFunctions {
    optionalProperty?: () => string;
    optionalMethod?(): string;
}



/*
Method cannot be declared as readonly
Property can



Use a method function if it refers to this, commonly for instances of classes



Only # private fields are truly private in runtime JavaScript



Type predicate
User defined type guard
Function that return a boolean to indicate whether an argument is a particular type



typeof
gets the type of a value



keyof
gets the allowed keys on a type



as
keyword followed by a type
type assertion - type cast
skip some type checking



One test that can help show whether a type parameter is necessary for a function is
it should be used at least twice.
If a generic type parameter only appears in one place, it can't possibly be defining a relationship between multiple types.



https://github.com/DefinitelyTyped/DefinitelyTyped
https://www.typescriptlang.org/dt/search?search=



Mapped types don't distinguish between method and property syntaxes on object types.
Mapped types treat method as property on original types.
*/



/*
Many database functions may use a property like
throwIfNotFound
to change the function to throw an error 
instead of returning undefined if a value isn't found. 
The following QueryResult type models that behavior by resulting in the more narrow string 
instead of string | undefined if the options' throwIfNotFound is known to be true.
*/
interface QueryOptions {
    throwIfNotFound: boolean;
}

type QueryResult<Options extends QueryOptions> =
    Options["throwIfNotFound"] extends true ? string : string | undefined;

declare function retrieve<Options extends QueryOptions>(
    key: string,
    options?: Options,
): Promise<QueryResult<Options>>;

// Returned type: string | undefined
await retrieve("TC");

// Returned type: string | undefined
await retrieve("TC2", { throwIfNotFound: Math.random() > 0.5});

// Returned type: string
await retrieve("TC3", { throwIfNotFound: true });



/*
"Type Distributivity"
Conditional types distribute over unions

ConditionalType<T | U> = ConditionalType<T> | ConditionalType<U>

https://www.oreilly.com/catalog/errata.csp?isbn=0636920578000
Page 261
https://www.google.ca/books/edition/Learning_TypeScript/YD5zEAAAQBAJ?hl=en&gbpv=1&dq=throwIfNotFound+Conditional+types+distribute+over+unions&pg=PA261&printsec=frontcover

ConditionalType<T | U> is the same as Conditional<T> | Conditional<U>
should be
ConditionalType<T | U> is the same as ConditionalType<T> | ConditionalType<U>
*/

/*
Checks whether the T is an array of some new Item type.
If it is, the resultant type is Item;
if not, it's T
*/
type ArrayItems<T> = T extends (infer Item)[] ? Item : T;

// Type : string
type StringItem = ArrayItems<string>;

// Type : string
type StringArrayItem = ArrayItems<string[]>;

// Type : string[]
type String2DItem = ArrayItems<string[][]>;


{
// Recursive
type ArrayItemsRecursive<T> = T extends (infer Item)[] ? ArrayItemsRecursive<Item> : T;

// Type : string
type StringItem = ArrayItemsRecursive<string>;

// Type : string
type StringArrayItem = ArrayItemsRecursive<string[]>;

// Type : string
type String2DItem = ArrayItemsRecursive<string[][]>;
}



/*
Mapped types apply a change to every member of an existing type.
Conditional types apply a change to a single existing type.
Together they allow for applying conditional logic to each member of a generic template type.
*/
type MakeAllMembersFunctions<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any
        ? T[K]
        : () => T[K]
};

type MembersFunctions = MakeAllMembersFunctions<{
    alreadyFunction: () => string,
    notYetFunction: number,
}>;
/*
Type:
{
    alreadyFunction: () => string,
    notYetFunction:  () => number,
}
*/



type OnlyStrings<T> = T extends string ? T : never;
type RedOrBlue = OnlyStrings<"red" | "blue" | 0 | false>;



type FirstParameter<T extends (...args: any[]) => any> =
    T extends (args: infer Arg) => any
    ? Arg
    : never;

type GetsString = FirstParameter<
    (arg0: string) => void
>;



