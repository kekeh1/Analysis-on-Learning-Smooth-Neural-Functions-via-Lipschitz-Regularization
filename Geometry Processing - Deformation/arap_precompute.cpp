#include "../include/arap_precompute.h"
#include <igl/min_quad_with_fixed.h>
#include <igl/arap_linear_block.h>
#include <igl/cotmatrix.h>

void arap_precompute(
  const Eigen::MatrixXd & V,
  const Eigen::MatrixXi & F,
  const Eigen::VectorXi & b,
  igl::min_quad_with_fixed_data<double> & data,
  Eigen::SparseMatrix<double> & K)
{
// REPLACE WITH YOUR CODE
	Eigen::SparseMatrix<double> L, Aeq;
	igl::cotmatrix(V, F, L);
	igl::min_quad_with_fixed_precompute(L, b, Aeq, false, data);
	
	int n = V.rows();
	K.resize(n, 3 * n);

	typedef Eigen::Triplet<double> T;
	std::vector<T> coefficients;
	coefficients.reserve(F.rows() * 3 * 3 * 6);


	Eigen::VectorXd e01, e12, e20;
	for (int i = 0; i < F.rows(); i++) {
		e01 = L.coeff(F(i, 0), F(i, 1)) * (V.row(F(i, 0)) - V.row(F(i, 1)));

		for (int v = 0; v < 3; v++) {
			for (int p = 0; p < 3; p++) {
				coefficients.push_back(T(F(i, 0), 3 * F(i, v) + p, e01(p) / 6.0));
				coefficients.push_back(T(F(i, 1), 3 * F(i, v) + p, -e01(p) / 6.0));
			}	
		}
		e12 = L.coeff(F(i, 1), F(i, 2)) * (V.row(F(i, 1)) - V.row(F(i, 2)));
		for (int v = 0; v < 3; v++) {
			for (int p = 0; p < 3; p++) {
				coefficients.push_back(T(F(i, 1), 3 * F(i, v) + p, e12(p) / 6.0));
				coefficients.push_back(T(F(i, 2), 3 * F(i, v) + p, -e12(p) / 6.0));
			}
		}
		e20 = L.coeff(F(i, 2), F(i, 0)) * (V.row(F(i, 2)) - V.row(F(i, 0)));
		for (int v = 0; v < 3; v++) {
			for (int p = 0; p < 3; p++) {
				coefficients.push_back(T(F(i, 2), 3 * F(i, v) + p, e20(p) / 6.0));
				coefficients.push_back(T(F(i, 0), 3 * F(i, v) + p, -e20(p) / 6.0));
			}
		}

	}
	K.setFromTriplets(coefficients.begin(), coefficients.end());


}
