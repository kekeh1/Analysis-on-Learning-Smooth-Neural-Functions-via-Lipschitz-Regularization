#include "../include/arap_single_iteration.h"
#include <igl/polar_svd3x3.h>
#include <igl/min_quad_with_fixed.h>

void arap_single_iteration(
  const igl::min_quad_with_fixed_data<double> & data,
  const Eigen::SparseMatrix<double> & K,
  const Eigen::MatrixXd & bc,
  Eigen::MatrixXd & U)
{
	Eigen::VectorXd Beq;
	Eigen::MatrixXd C, R;
	R.resize(3 * data.n, 3);
	C = (U.transpose() * K).transpose();

	for (int i = 0; i < data.n; i++) {
		Eigen::Matrix3d C_k = C.block(3 * i, 0, 3, 3);
		Eigen::Matrix3d R_k;
		igl::polar_svd3x3(C_k, R_k);
		R.block(3 * i, 0, 3, 3) = R_k;
	}
	
	igl::min_quad_with_fixed_solve(data, K * R, bc, Beq, U);
}
