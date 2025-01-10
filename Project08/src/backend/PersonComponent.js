
2   import Parse from 'parse/dist/parse.min.js';
    import React,{useState} from 'react'
3
4    const PersonComponent = () => {
5     // State variables
6     const [person, setPerson] = useState(null);
7
8     async function addPerson() {
9       try {
10        // create a new Parse Object instance
11        const Person = new Parse.Object('Person');
12        // define the attributes you want for your Object
13        Person.set('name', 'John');
14        Person.set('email', 'john@back4app.com');
15        // save it on Back4App Data Store
16        await Person.save();
17        alert('Person saved!');
18      } catch (error) {
19        console.log('Error saving new person: ', error);
20      }
21    }
22
23    async function fetchPerson() {
24      // create your Parse Query using the Person Class you've created
25      const query = new Parse.Query('Person');
26      // use the equalTo filter to look for user which the name is John. this filter can be used in any data type
27      query.equalTo('name', 'John');
28      // run the query
29      const Person = await query.first();
30      // access the Parse Object attributes
31      console.log('person name: ', Person.get('name'));
32      console.log('person email: ', Person.get('email'));
33      console.log('person id: ', Person.id);
34      setPerson(Person);
35    }
36
37    return (
38      <div>
39        <button onClick={addPerson}>Add Person</button>
40        <button onClick={fetchPerson}>Fetch Person</button>
41        {person !== null && (
42          <div>
43            <p>{`Name: ${person.get('name')}`}</p>
44            <p>{`Email: ${person.get('email')}`}</p>
45          </div>
46        )}
47      </div>
48    );
49  }