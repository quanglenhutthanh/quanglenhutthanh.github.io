---
sidebar_position: 40
sidebar_label : "NumPy"
---
# Introduction

![NumPy](img/numpy.png)

**NumPy** short for Numerical Python. NumPy is a fundemental package for scientific computing in Python.It is a Python library that provides a multidimensional array object, various derived objects (such as masked arrays and matrices),and an assortment of routines for fast operations on arrays, including mathematical, logical, shape manipulation, sorting, selecting, I/O, discrete Fourier transforms, basic linear algebra, basic statistical operations, random simulation and much more.



# Getting Started
## Installation
Using `pip`, you can install NumPy with:

```cmd
pip intall numpy
```
## Import NumPy
Once NumPy installed, you can import it in your applications:

```python
import numpy
```

## NumPy as np
NumPy is usually imported as `np` alias.
```python
import numpy as np
```


# Usage


```python
import numpy as np
```

## NumPy array
NumPy's primary object is the homogeneous multidimensional array. The NumPy array is a data structure that efficiently stores and accesses multidimensional arrays. 


```python
# Define a 1D array
my_array = np.array([1, 2, 3, 4, 5])
print(my_array)
```


```python
# Define a 2D array
my_2d_array = np.array([[1, 2, 3, 4],
                        [5, 6, 7, 8]],
                       dtype=np.int64)
print(my_2d_array)
```


```python
# Define a 3D array
my_3d_array = np.array([[[1, 2, 3, 4],
                         [5, 6, 7, 8]],
                        [[1, 2, 3, 4],
                         [9, 10, 11, 12]]],
                       dtype=np.int64)
print(my_3d_array)
```

### Array Operations
NumPy allows for efficient element-wise operations and mathematical computations on arrays.


```python
# Element-wise operations
arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])

# Addition
result = arr1 + arr2

# Multiplication
result = arr1 * arr2
```

### Array Indexing and Slicing
You can access elements or sub-arrays of NumPy arrays using indexing and slicing, similar to Python lists.


```python
arr = np.array([1, 2, 3, 4, 5])

# Accessing elements
print(arr[0])  # Accessing the first element
print(arr[2:4])  # Slicing from index 2 to 3
```


```python
arr = np.array([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]])
print(arr[0, 1, 2])
```

Negative Indexing


```python
arr = np.array([[1,2,3,4,5], [6,7,8,9,10]])
print('Last element from 2nd dim: ', arr[1, -1])
```

## NumPy Random

### Generate Random Number


```python
# Generate a random integer from 0 to 100
x = np.random.randint(100)
print(x)
```


```python
# Generate a random float from 0 to 1
x = np.random.rand()
print(x)
```

### Generate Random Array


```python
# Generate a 1-D array contains 5 integers from 0 to 100:
x = np.random.randint(100,size=(5))
print(x)
```


```python
# Generate a 2-D array with 3 rows, each row containing 5 random integers from 0 to 100:
x = np.random.randint(100, size=(3,5))
print(x)
```

### Generate Random Number From Array
the `choice` method allow you to generate a random value based on an array of values.


```python
x = np.random.choice([3, 5, 7, 9])
print(x)
```


```python
x = np.random.rand(3,5)
print(x)
```

### Permutations and Shuffling
A permutation refers to an arrangement of elements. e.g. [3, 2, 1] is a permutation of [1, 2, 3] and vice-versa. 

Shuffle means changing arrangement of elements.


```python
# Generate a random permutation of elements
arr = np.array([1, 2, 3, 4, 5])
print(np.random.permutation(arr))
```


```python
arr = np.array([1, 2, 3, 4, 5])
np.random.shuffle(arr)
arr
```

### Distributions

Visualize Distributions With Seaborn


```python
import matplotlib.pyplot as plt
import seaborn as sns
```

### Data Distribution
Data Distribution is a list of all possible values, and how often each value occurs.


```python
x = np.random.choice([3, 5, 7, 9], p=[0.1, 0.3, 0.6, 0.0], size=(100))

print(x)
```

**Example Random Distributiom**

Generate a 1-D array containing 100 values, where each value has to be 3, 5, 7 or 9.

The probability for the value to be 3 is set to be 0.1

The probability for the value to be 5 is set to be 0.3

The probability for the value to be 7 is set to be 0.6

The probability for the value to be 9 is set to be 0


```python
x = np.random.choice([3, 5, 7, 9], p=[0.1, 0.3, 0.6, 0.0], size=(100))
print(x)
```

### Normal Distribution
What Is a Normal Distribution? Normal distribution, also known as the Gaussian distribution, is a probability distribution that is symmetric about the mean, showing that data near the mean are more frequent in occurrence than data far from the mean. In graphical form, the normal distribution appears as a "bell curve".

Use the `random.normal()` method to get a Normal Data Distribution.

It has three parameters:

`loc`

`scale`

`size`


```python
sns.distplot(np.random.normal(size=1000),hist=False)
plt.show()
```

### Binomial Distribution
The binomial distribution describes the probability of a certain number of successes in a fixed number of independent trials, each with the same probability of success. It's used in various fields to model situations like coin flips, where there are two possible outcomes with a constant probability.

It has three parameters:

`n` - number of trials.

`p` - propability of occurences of each trials.

`size` - the shaped of returned array.



```python
# Given 10 trials for coin toss generate 10 data points:
x = np.random.binomial(n=10, p=0.5, size=10)
print(x)
```


```python
sns.distplot(np.random.binomial(n=5,p=0.5, size=100))
```

### Poisson Distribution
It estimates how many times an event can happen in a specified time. e.g. If someone eats twice a day what is the probability he will eat thrice?

It has two parameters:

`lam` - rate or known number of occurrences e.g. 2 for above problem.

`size` - The shape of the returned array.


```python
x = np.random.poisson(lam=10,size=1000)
print(x)
```


```python
sns.distplot(np.random.poisson(lam=10, size=1000))

plt.show()
```

### Uniform Distribution
Used to describe probability where every event has equal chances of occuring.

It has three parameters:

lower bound

upper bound

`size` - the shape of returned array.


```python
x = np.random.uniform(1,10,size=100)
print(x)
```


```python
sns.distplot(np.random.uniform(size=1000),hist=False)
plt.show()
```

## Unirversal Functions (ufuncs)
unfuncs are functions that operate on the array objects.

