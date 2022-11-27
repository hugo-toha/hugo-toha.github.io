---
title: Machine Learning
weight: 40
menu:
  notes:
    name: Machine Learning
    identifier: notes-python-ml
    parent: notes-python
    weight: 30
---

{{< note title="Exemple regression - Keras">}}

```python
import tensorflow as tf
from tensorflow import keras

model = keras.models.Sequential()
model.add(keras.layers.Input(shape, name="InputLayer"))
model.add(keras.layers.Dense(32, activation='relu', name='Dense_n1'))
model.add(keras.layers.Dense(64, activation='relu', name='Dense_n2'))
model.add(keras.layers.Dense(32, activation='relu', name='Dense_n3'))
model.add(keras.layers.Dense(1, name='Output'))


model.compile(optimizer = 'adam',
              loss      = 'mse',
              metrics   = ['mae', 'mse'] )

history = model.fit(x_train,
                    y_train,
                    epochs          = 60,
                    batch_size      = 10,
                    verbose         = fit_verbosity,
                    validation_data = (x_test, y_test))

score = model.evaluate(x_test, y_test, verbose=0)

predictions = model.predict( my_data )
```
{{< /note >}}

