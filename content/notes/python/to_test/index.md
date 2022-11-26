---
title: To_test
weight: 30
menu:
  notes:
    name: To test
    identifier: notes-python-to_test
    parent: notes-python
    weight: 30
---

<!-- Condition -->
{{< note title="Force typing - pydantic">}}
Permet d'imposer les types. La vérification est effectuée à l'exécution. 
https://pydantic-docs.helpmanual.io/

Utilisation : 
```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name = 'John Doe'
    signup_ts: datetime | None = None
    friends: list[int] = []
```
Une ValidationError est levée quand le type n'est pas respecté. 
```python
from pydantic import ValidationError

try:
    User(signup_ts='broken', friends=[1, 2, 'not number'])
except ValidationError as e:
    print(e.json())
```


{{< /note >}}
